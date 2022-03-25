import React from "react"

import ChatIcon from "@mui/icons-material/Chat"
import { ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import useFetchDataNoSave from "hooks/useFetchDataNoSave"
import { useParams } from "react-router-dom"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import "./index.css"

const ChatRoom = () => {
    const { id } = useParams()

    const myInfor = useStore((state) => state.myInfor)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setNewMessengers = useStore((state) => state.setNewMessengers)

    useFetchDataNoSave(MessengerApiPath.messengersInRoom(id), setNewMessengers, [id])

    useFetchDataNoSave(
        ChatRoomApiPath.chatRoomDetail(id),
        (res) => {
            if (!res){
                setChatRoomInfor(null)

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

    return (
        <div className="h-full chat-room">
            { chatRoomInfor ? (
                <>
                    <Header />

                    <Content />
                </>
            ) : (
                <div className="w-full h-full flex-center flex-col space-y-6">
                    <ChatIcon sx={ { fontSize: 120 } } />

                    <p className="text-xl font-semibold">
                        Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
                    </p>
                </div>
            ) }
        </div>
    )
}

export default ChatRoom
