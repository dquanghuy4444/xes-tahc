import React, { useEffect } from "react"

import { SOCKET_EVENT_NAMES } from "configs"
import { UserApiPath } from "configs/api-paths"
import { SOCKET_URL } from "configs/env"
import { fetchData } from "helper"
import { useNavigate } from "react-router-dom"
import { connect } from "socket.io-client"
import { useStore } from "store"

import Content from "./Content"
import Header from "./Header"
import InformationBar from "./InformationBar"
import Sidebar from "./Sidebar"

import "./index.css"

const Index = ({ children }) => {
    const navigate = useNavigate()

    const isInforBarDisplayed = useStore((state) => state.isInforBarDisplayed)
    const socket = useStore((state) => state.socket)
    const myInfor = useStore((state) => state.myInfor)
    const setSocket = useStore((state) => state.setSocket)

    const setMyInfor = useStore((state) => state.setMyInfor)

    useEffect(() => {
        const getAuthen = async() => {
            const res = await fetchData(UserApiPath.myDetail)

            if (!res){
                navigate("/login", { replace: true })
            }

            setMyInfor(res)
        }

        getAuthen()
    }, [])

    useEffect(() => {
        if (!myInfor){
            return
        }
        setSocket(connect(SOCKET_URL))
    }, [myInfor])

    useEffect(() => {
        if (!socket || !myInfor){
            return
        }

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_USERID, { id: myInfor.id })

        return () => {
            socket.disconnect()
        }
    }, [socket])

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
