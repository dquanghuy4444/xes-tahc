import React from "react"

import useFetchDataNoSave from "hooks/useFetchDataNoSave"
import { useParams } from "react-router-dom"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import "./index.css"

const ChatRoom = () => {
    const { id } = useParams()

    const myInfor = useStore((state) => state.myInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setMessengers = useStore((state) => state.setMessengers)

    useFetchDataNoSave(`/messengers/${id}`, setMessengers, [id])

    useFetchDataNoSave(`/chat-rooms/${id}`, (res) => {
        setChatRoomInfor({
            ...res,
            userInfors: [
                ...res.userInfors,
                {
                    ...myInfor,
                    isMe: true
                }
            ]
        })
    }, [id , myInfor])

    return (
        <div className="h-full chat-room">
            <Header />

            <Content />
        </div>
    )
}

export default ChatRoom
