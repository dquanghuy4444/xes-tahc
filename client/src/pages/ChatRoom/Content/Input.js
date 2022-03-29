import { ENUM_MESSAGE_TYPE } from "constants"

import React, { useState } from "react"

import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"
import SendIcon from "@mui/icons-material/Send"
import TextField from "@mui/material/TextField"
import { SOCKET_EVENT_NAMES } from "configs"
import { MessengerApiPath } from "configs/api-paths"
import { postData } from "helper"
import useEventListener from "hooks/useEventListener"
import { useParams } from "react-router-dom"
import { useStore } from "store"

const Input = () => {
    const { id } = useParams()

    const socket = useStore((state) => state.socket)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)

    const [message, setMessage] = useState("")
    const [isFocus, setIsFocus] = useState(true)

    const handleSendMessage = async() => {
        if (!message){
            return
        }
        const mess = await postData(MessengerApiPath.index, {
            content    : message,
            type       : ENUM_MESSAGE_TYPE.TEXT,
            chatRoomId : id
        })

        if (mess){
            socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
                ...mess,
                userIds: chatRoomInfor.userInfors
                    .filter((info) => info.stillIn)
                    .map((info) => info.id),
                userInfor : myInfor,
                chatRoom  : {
                    id   : chatRoomInfor.id,
                    name : chatRoomInfor.name
                }
            })

            setMessage("")
        }
    }

    useEventListener("keypress", (e) => {
        if (e.keyCode === 13 && isFocus){
            handleSendMessage()
        }
    })

    return (
        <div className="min-h-[60px] flex items-center space-x-3 px-4">
            <InsertPhotoIcon color="primary" sx={ { cursor: "pointer" } } />

            <TextField
                fullWidth
                hiddenLabel
                size="small"
                value={ message }
                onBlur={ () => setIsFocus(false) }
                onChange={ (e) => setMessage(e.target.value) }
                onFocus={ () => setIsFocus(true) }
            />

            <SendIcon color="primary" sx={ { cursor: "pointer" } } onClick={ handleSendMessage } />
        </div>
    )
}

export default Input
