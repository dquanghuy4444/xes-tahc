import React, { useMemo, useRef, useEffect } from "react"

import { useStore } from "store"

import FirstMessenger from "./FirstMessenger"
import Input from "./Input"
import MessengerCard from "./MessengerCard"

const Content = () => {
    const endMessengerRef = useRef(null)

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const messengers = useStore((state) => state.messengers)

    const scrollToBottom = () => {
        if (endMessengerRef?.current){
            endMessengerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messengers])

    const messengersWithUserInfor = useMemo(() => {
        const userInfors = chatRoomInfor?.userInfors || []

        return messengers.map((mess) => ({
            ...mess,
            userInfor : userInfors.find((info) => info.id === mess.createdBy),
            info      : {
                ...mess.info,
                userInfor: userInfors.find((info) => info.id === mess?.info?.victim)
            }
        }))
    }, [chatRoomInfor, messengers])


    return (
        <div className="h-full flex flex-col chat">
            <div className="content-chat overflow-auto">
                <div className=" px-4 flex flex-col justify-end space-y-2 mt-8">
                    <FirstMessenger />

                    { messengersWithUserInfor.map((mess) => (
                        <MessengerCard { ...mess } key={ mess.id } />
                    )) }

                    <div ref={ endMessengerRef } />
                </div>
            </div>

            {
                chatRoomInfor?.blockedIds.length > 0 ? (
                    <div className="min-h-[60px] text-center flex-col flex-center bg-quinary--light">
                        <p className="text-lg font-semibold">Hiện tại , bạn không thể gửi tin nhắn cho người dùng này được</p>
                    </div>
                ) : (
                    <Input />

                )
            }
        </div>
    )
}

export default Content
