import { ENUM_MESSAGE_TYPE , ENUM_MESSAGE_INFO_TYPE } from "constants"

import React , {useState} from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { putData , postData } from "helper"
import { useParams } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

export default function ModalChangeName({open , setOpen}){
    const { id } = useParams()

    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setChatRoomDescriptions = useStore((state) => state.setChatRoomDescriptions)
    const setMessengers = useStore((state) => state.setMessengers)


    const [name , setName] = useState("")

    const handleClose = () => {
        setOpen(false)
    }

    const handleChangeName = async() => {
        if(!name){
            return
        }
        const chatRoom = await putData(`chat-rooms`,id, {
            name
        })

        if(!chatRoom){
            return
        }

        const mess = await postData("messengers", {
            content : name,
            type    : ENUM_MESSAGE_TYPE.INFO,
            info    : {
                type: ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP

            },
            chatRoomId: id
        })

        setMessengers([mess])

        setChatRoomDescriptions([{
            name,
            id
        }])
        setChatRoomInfor({name})
        showNotification("success" , "Bạn đã thay đổi tên thành công")
        setName("")
        handleClose()
    }

    return (
        <Dialog open={ open } onClose={ handleClose }>
            <DialogTitle>Đổi tên nhóm</DialogTitle>

            <DialogContent sx={ {minWidth: 200} }>
                <TextField
                    autoFocus
                    fullWidth
                    label="Tên nhóm"
                    margin="dense"
                    value={ name }
                    variant="standard"
                    onChange={ (e) => setName(e.target.value) }
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={ handleClose }>Hủy</Button>

                <Button onClick={ handleChangeName }>Lưu</Button>
            </DialogActions>
        </Dialog>
    )
}
