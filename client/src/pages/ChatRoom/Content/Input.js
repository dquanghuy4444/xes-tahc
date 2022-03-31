import { ENUM_MESSAGE_TYPE } from "constants"

import React, { useState } from "react"

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"
import SendIcon from "@mui/icons-material/Send"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import OutlinedInput from "@mui/material/OutlinedInput"
import { SOCKET_EVENT_NAMES } from "configs"
import { MessengerApiPath } from "configs/api-paths"
import Picker from "emoji-picker-react"
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
    const [isFocused, setIsFocused] = useState(true)
    const [isEmojiDisplayed, setIsEmojiDisplayed] = useState(false)

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
                userInfors  : chatRoomInfor.isGroup ? [] : chatRoomInfor.userInfors,
                senderInfor : myInfor,
                chatRoom    : {
                    id      : chatRoomInfor.id,
                    name    : chatRoomInfor.name,
                    avatar  : chatRoomInfor.avatar,
                    isGroup : chatRoomInfor.isGroup
                }
            })

            setMessage("")
        }
    }

    useEventListener("keypress", (e) => {
        if (e.keyCode === 13 && isFocused){
            handleSendMessage()
        }
    })

    useEventListener("keyup", (e) => {
        if (e.key === "Escape" && isEmojiDisplayed){
            setIsEmojiDisplayed(false)
        }
    })

    const handleAddEmoji = (e , emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji)
    }

    return (
        <div className="min-h-[60px] flex items-center space-x-3 px-4">
            <InsertPhotoIcon color="primary" sx={ { cursor: "pointer" } } />

            <div className="relative flex-1">
                <OutlinedInput
                    fullWidth
                    endAdornment={ (
                        <InputAdornment position="end">
                            <IconButton edge="end" onClick={ () => setIsEmojiDisplayed((prev) => !prev) }>
                                <EmojiEmotionsIcon />
                            </IconButton>
                        </InputAdornment>
                      ) }
                    size="small"
                    value={ message }
                    onBlur={ () => setIsFocused(false) }
                    onChange={ (e) => setMessage(e.target.value) }
                    onFocus={ () => setIsFocused(true) }
                />

                <Picker
                    pickerStyle={ {
                        display  : isEmojiDisplayed ? "" : "none",
                        position : "absolute",
                        right    : 0,
                        bottom   : "120%"
                    } }
                    onEmojiClick={ handleAddEmoji }
                />
            </div>

            <SendIcon color="primary" sx={ { cursor: "pointer" } } onClick={ handleSendMessage } />
        </div>
    )
}

export default Input
