import React, { useMemo, useRef } from "react"

import { info } from "autoprefixer"
import { useStore } from "store"

import FirstMessenger from "./FirstMessenger"
import Input from "./Input"
import MessengerCard from "./MessengerCard"

const Content = () => {
    const endMessengerRef = useRef(null)

    const roomInfor = useStore((state) => state.chatRoomInfor)
    const messengers = useStore((state) => state.messengers)

    const scrollToBottom = () => {
        if (endMessengerRef?.current){
            endMessengerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    const messengersWithUserInfor = useMemo(() => {
        const userInfors = roomInfor?.userInfors || []

        return messengers.map((mess) => ({
            ...mess,
            userInfor : userInfors.find((info) => info.id === mess.createdBy),
            info      : {
                ...mess.info,
                userInfor: userInfors.find((info) => info.id === mess?.info?.victim)

            }
        }))
    }, [roomInfor, messengers])
    console.log(messengersWithUserInfor);

return (
    <div className="h-full flex flex-col chat">
        <div className="content-chat overflow-auto mb-2">
            <div className=" px-4 flex flex-col justify-end space-y-2 mt-8">
                <FirstMessenger />

                { messengersWithUserInfor.map((mess) => (
                    <MessengerCard { ...mess } key={ mess.id } />
                    )) }

                <div ref={ endMessengerRef } />
            </div>
        </div>

        <Input />
    </div>
    )
}

export default Content
