import React, { useEffect } from "react"

import { SOCKET_EVENT_NAMES } from "configs"
import { SOCKET_URL } from "configs/env"
import { connect } from "socket.io-client"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import InformationBar from "./InformationBar"
import Sidebar from "./Sidebar"

import "./index.css"

const Index = ({ children }) => {
    const isInforBarDisplayed = useStore((state) => state.isInforBarDisplayed)
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

            <main className="flex main-layout max-w-screen">
                <Sidebar />

                <Content>{ children }</Content>

                { isInforBarDisplayed && <InformationBar /> }
            </main>
        </div>
    )
}

export default Index
