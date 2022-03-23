import React from "react"

import useFetchData from "hooks/useFetchData"
import { useParams } from "react-router-dom"

import Content from "./Content"
import Header from "./Header"
import "./index.css"

const ChatRoom = () => {
    const { id } = useParams()

    const data = useFetchData(`/chat-rooms/${id}`, null, [id])

    return (
        <div className="h-full chat">
            <Header avatar={ data?.avatar } id={ id } name={ data?.name } />

            <Content id={ id } messengers={ data?.messengers } userInfors={ data?.userInfors } />
        </div>
    )
}

export default ChatRoom
