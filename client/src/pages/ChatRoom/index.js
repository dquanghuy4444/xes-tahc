import React from "react"

import useFetchData from "hooks/useFetchData"
import { useParams } from "react-router-dom"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import "./index.css"

const ChatRoom = () => {
    const myInfor = useStore((state) => state.myInfor)

    const { id } = useParams()

    const roomInfor = useFetchData(`/chat-rooms/${id}`, null, [id])

    const messengers = useFetchData(`/messengers/${id}`, null, [id])

    const userInfors =
        roomInfor?.userInfors && myInfor
            ? [
                  ...roomInfor.userInfors,
                  {
                      ...myInfor,
                      isMe: true
                  }
              ]
            : []

    return (
        <div className="h-full chat-room">
            <Header avatar={ roomInfor?.avatar } id={ id } name={ roomInfor?.name } />

            <Content
                avatar={ roomInfor?.avatar }
                createdAt={ roomInfor?.createdAt }
                createdBy={ roomInfor?.createdBy }
                id={ id }
                isGroup={ roomInfor?.isGroup }
                messengers={ messengers || [] }
                name={ roomInfor?.name }
                userInfors={ userInfors }
            />
        </div>
    )
}

export default ChatRoom
