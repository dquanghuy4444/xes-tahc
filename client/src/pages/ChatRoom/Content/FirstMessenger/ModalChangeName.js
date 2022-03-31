import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React, { useState } from "react"


import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { SOCKET_EVENT_NAMES } from "configs"
import { ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import { putData, postData } from "helper"
import { useParams } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

export default function ModalChangeName({ open, setOpen }){
    const { id } = useParams()

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)
    const socket = useStore((state) => state.socket)

    const [name, setName] = useState("")

    const handleClose = () => {
        setOpen(false)
    }

    const handleChangeName = async() => {
        if (!name){
            return
        }
        const chatRoom = await putData(ChatRoomApiPath.chatRoomDetail(id), {
            name
        })

        if (!chatRoom){
            return
        }

        const mess = await postData(MessengerApiPath.index, {
            content : name,
            type    : ENUM_MESSAGE_TYPE.INFO,
            info    : {
                type: ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP
            },
            chatRoomId: id
        })


        if (mess){
            socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
                ...mess,
                userIds     : chatRoomInfor.userInfors.filter((info) => info.stillIn).map((info) => info.id),
                senderInfor : myInfor,
                chatRoom    : {
                    id: chatRoomInfor.id,
                    name
                }
            })

            showNotification("success", "Bạn đã thay đổi tên thành công")
            setName("")
            handleClose()
        }
    }

    return (
        <Dialog open={ open } onClose={ handleClose }>
            <DialogTitle>Đổi tên nhóm</DialogTitle>

            <DialogContent sx={ { minWidth: 200 } }>
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
