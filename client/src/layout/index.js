import React, { useEffect } from "react"

import { SOCKET_EVENT_NAMES } from "configs"
import { SOCKET_URL } from "configs/env"
import { connect } from "socket.io-client"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import Sidebar from "./Sidebar"

import "./index.css"

const Index = ({ children }) => {
    const socket = useStore((state) => state.socket)
    const myInfor = useStore((state) => state.myInfor)
    const setSocket = useStore((state) => state.setSocket)

    useEffect(() => {
        setSocket(connect(SOCKET_URL))
    }, [])

    useEffect(() => {
        if (!socket || !myInfor){
            return
        }

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_USERID, { id: myInfor.id })

        return () => {
            socket.disconnect()
        }
    }, [socket, myInfor])

    return (
        <div className="h-screen flex flex-col bg-white">
            <Header />

            <main className="flex main-layout">
                <Sidebar />

                <Content>{ children }</Content>
            </main>
        </div>
    )
}

export default Index
