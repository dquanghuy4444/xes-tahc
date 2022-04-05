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
import { useStore } from "store"
import buildFileSelector from "utils/build-file-selector"
import { v4 as uuidv4 } from "uuid"

const Input = () => {


    const socket = useStore((state) => state.socket)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)
    const setMessengers = useStore((state) => state.setMessengers)

    const [message, setMessage] = useState("")
    const [files, setFiles] = useState([])
    const [isFocused, setIsFocused] = useState(true)
    const [isEmojiDisplayed, setIsEmojiDisplayed] = useState(false)

    const sendFilesToServer = async(images, messId) => {
        const formData = new FormData()
        formData.append("chatRoomId", chatRoomInfor.id)
        images.forEach((f) => {
            formData.append("files", f.file)
        })

        const mess = await postData(MessengerApiPath.sendFiles, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
            ...mess,
            messId,
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
    }

    const handleSendMessage = async() => {
        if (files.length > 0){
            const messId = uuidv4()

            setMessengers([
                {
                    content     : "",
                    type        : ENUM_MESSAGE_TYPE.IMAGE,
                    chatRoomId  : id,
                    id          : messId,
                    messId,
                    attachments : files.map((file) => ({
                        name : uuidv4(),
                        path : ""
                    })),
                    createdBy : myInfor.id,
                    userIds   : chatRoomInfor.userInfors
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
                }
            ])

            sendFilesToServer(files, messId)

            setFiles([])
        }

        if (!message){
            return
        }

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
            content     : message,
            type        : ENUM_MESSAGE_TYPE.TEXT,
            chatRoomId  : chatRoomInfor.id,
            id          : uuidv4(),
            createdBy   : myInfor.id,
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

        postData(MessengerApiPath.index, {
            content    : message,
            type       : ENUM_MESSAGE_TYPE.TEXT,
            chatRoomId : chatRoomInfor.id
        })
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
            <div className="bottom-full border-border absolute left-0 w-full bg-white border-t-2">
                <div className="snap-mandatory scroll-smooth snap-x flex-nowrap flex w-full px-4 pt-4 pb-2 space-x-4 overflow-x-auto">
                    { files.map((f) => {
                        const objectUrl = URL.createObjectURL(f.file)

                        return (
                            <div className="relative" key={ f.id }>
                                <div className="w-max overflow-hidden rounded-lg shadow">
                                    <img alt={ "" } className="h-[68px] w-full" src={ objectUrl } />
                                </div>

                                <div
                                    className="-right-1 -top-1 shadow-secondary flex-center absolute w-5 h-5 bg-white rounded-full cursor-pointer"
                                    onClick={ () => handleRemoveFile(f.id) }
                                >
                                    <CloseIcon sx={ { fontSize: 16 } } />
                                </div>
                            </div>
                        )
                    }) }
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            { showImageFilesWrapper() }

            <div className="min-h-[60px] flex items-center space-x-3 p-4">
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
