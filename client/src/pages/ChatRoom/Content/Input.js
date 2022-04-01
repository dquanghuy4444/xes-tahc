import { ENUM_MESSAGE_TYPE } from "constants"

import React, { useState } from "react"

import CloseIcon from "@mui/icons-material/Close"
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
import buildFileSelector from "utils/build-file-selector"
import { v4 as uuidv4 } from "uuid"

const Input = () => {
    const { id } = useParams()

    const socket = useStore((state) => state.socket)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)

    const [message, setMessage] = useState("")
    const [files, setFiles] = useState([])
    const [isFocused, setIsFocused] = useState(true)
    const [isEmojiDisplayed, setIsEmojiDisplayed] = useState(false)

    const handleSendMessage = async() => {
        if (files.length > 0){
            const formData = new FormData()
            formData.append("chatRoomId", id)
            files.forEach((f) => {
                formData.append("files", f.file)
            })
            const mess = await postData(MessengerApiPath.sendFiles, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if (mess){
                setFiles([])
            }
        }

        if (!message){
            return
        }

        const mess = await postData(MessengerApiPath.index, {
            content    : message,
            type       : ENUM_MESSAGE_TYPE.TEXT,
            chatRoomId : id
        })

        if (!mess){
            return
        }

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
            ...mess,
            userIds     : chatRoomInfor.userInfors.filter((info) => info.stillIn).map((info) => info.id),
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

    const handleAddEmoji = (e, emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji)
    }

    const cbSelecteFiles = async(fileList) => {
        if (fileList.length === 0){
            return
        }

        setFiles((prev) => [
            ...prev,
            ...fileList.map((file) => ({
                id: uuidv4(),
                file
            }))
        ])
    }

    const fileSelector = buildFileSelector(cbSelecteFiles)

    const handleAddImages = (e) => {
        e.preventDefault()
        fileSelector.click()
    }

    const showImageFilesWrapper = () => {
        if (files.length === 0){
            return <></>
        }

        const handleRemoveFile = (fileId) => {
            const index = files.findIndex((f) => f.id === fileId)

            if (index !== -1){
                const temp = [...files]
                temp.splice(index, 1)

                setFiles(temp)
            }
        }

        return (
            <div className="w-full absolute bottom-full left-0 bg-white px-4 pb-2 pt-4 border-border border-t-2 flex space-x-4">
                { files.map((f) => {
                    const objectUrl = URL.createObjectURL(f.file)

                    return (
                        <div className="relative" key={ f.id }>
                            <div className="rounded-lg overflow-hidden shadow">
                                <img className="h-[68px] w-full" src={ objectUrl } />
                            </div>

                            <div
                                className="absolute -right-1 -top-1 rounded-full	bg-white shadow-secondary w-5 h-5 flex-center cursor-pointer"
                                onClick={ () => handleRemoveFile(f.id) }
                            >
                                <CloseIcon sx={ { fontSize: 16 } } />
                            </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

    return (
        <div className="relative">
            { showImageFilesWrapper() }

            <div className="min-h-[60px] flex items-center space-x-3 px-4">
                <InsertPhotoIcon
                    color="primary"
                    sx={ { cursor: "pointer" } }
                    onClick={ handleAddImages }
                />

                <div className="relative flex-1">
                    <OutlinedInput
                        fullWidth
                        endAdornment={ (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={ () => setIsEmojiDisplayed((prev) => !prev) }
                                >
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
        </div>
    )
}

export default Input
