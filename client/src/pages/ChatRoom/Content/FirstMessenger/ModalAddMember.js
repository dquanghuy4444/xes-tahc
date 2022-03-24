import React, { useState } from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { putData } from "helper"
import useFetchData from "hooks/useFetchData"
import { useParams } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

export default function ModalAddMember({ open, setOpen }){
    const { id } = useParams()

    const roomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setChatRoomDescriptions = useStore((state) => state.setChatRoomDescriptions)


    useFetchData(
        `users${
            roomInfor?.userInfors.length > 0
                ? `?remove_users=${roomInfor.userInfors.map((info) => info.id).join(",")}`
                : ""
        }` , null , [id]
    )

    const [name, setName] = useState("")

    const handleClose = () => {
        setOpen(false)
    }

    const handleChangeName = async() => {
        if (!name){
            return
        }
        const res = await putData(`chat-rooms`, id, {
            name
        })

        if (res){
            setChatRoomDescriptions([
                {
                    name,
                    id
                }
            ])
            setChatRoomInfor({ name })
            showNotification("success", "Bạn đã thay đổi tên thành công")
            setName("")
            handleClose()
        }
    }

    return (
        <Dialog open={ open } onClose={ handleClose }>
            <DialogTitle>Thêm thành viên</DialogTitle>

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
