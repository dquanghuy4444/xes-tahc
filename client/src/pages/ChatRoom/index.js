import { ENUM_STATUS_SET_STATE_ZUSTAND, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React, { useEffect } from "react"

import ChatIcon from "@mui/icons-material/Chat"
import { SOCKET_EVENT_NAMES } from "configs"
import { ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import useFetchDataNoSave from "hooks/useFetchDataNoSave"
import useSocketOn from "hooks/useSocketOn"
import { useParams } from "react-router-dom"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import "./index.css"

const ChatRoom = () => {
    const { id } = useParams()

    const socket = useStore((state) => state.socket)
    const myInfor = useStore((state) => state.myInfor)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setMessengers = useStore((state) => state.setMessengers)

    useFetchDataNoSave(
        MessengerApiPath.messengersInRoom(id),
        (response) => {
            setMessengers(response, ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW)
        },
        [id]
    )

    useFetchDataNoSave(
        ChatRoomApiPath.chatRoomDetail(id),
        (res) => {
            if (!res || !myInfor){
                return
            }
            setChatRoomInfor({
                ...res,
                userInfors: [
                    ...res.userInfors,
                    {
                        ...myInfor,
                        userId  : myInfor.id,
                        stillIn : true,
                        isMe    : true
                    }
                ]
            })
        },
        [id, myInfor]
    )

    useEffect(() => {
        if (!socket || !chatRoomInfor){
            return
        }
        socket.emit(SOCKET_EVENT_NAMES.CLIENT.JOIN_ROOM, {
            roomId : chatRoomInfor.id,
            userId : myInfor.id
        })
    }, [socket, chatRoomInfor])

    useSocketOn(SOCKET_EVENT_NAMES.SERVER_SOCKET.SEND_DATA_FOR_CHAT_ROOM_MESSENGERS, (data) => {
        if (
            data?.info?.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT &&
            data?.info?.victim === myInfor.id
        ){
            return
        }
        setMessengers([data])
    })

    return (
        <div className="h-full chat-room">
            { chatRoomInfor ? (
                <>
                    <Header />

                    <Content />
                </>
            ) : (
                <div className="w-full h-full flex-center flex-col space-y-6 px-10">
                    <ChatIcon sx={ { fontSize: 120 } } />

                    <p className="text-xl font-semibold text-center">
                        Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
                    </p>
                </div>
            ) }
        </div>
    )
}

export default ChatRoom
