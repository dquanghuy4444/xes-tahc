import React, { useMemo, useRef, useEffect } from "react"

import Avatar from "@mui/material/Avatar"
import { formatDatetime } from "utils/datetime"

import Input from "./Input"
import MessengerCard from "./MessengerCard"

const Content = ({ messengers, id, isGroup, createdBy, userInfors, avatar, name, createdAt }) => {
    const endMessengerRef = useRef(null)

    const scrollToBottom = () => {
        if (endMessengerRef?.current){
            endMessengerRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useEffect(() => {

    }, [messengers])

    const messengersWithUserInfor = useMemo(() => {
        return messengers.map((mess) => ({
            ...mess,
            userInfor: userInfors.find((info) => info.id === mess.senderId)
        }))
    }, [userInfors, messengers])

    const showInforGroup = () => {
        if (!isGroup){
            return <></>
        }

        const userInfor = userInfors.find((info) => info.id === createdBy)
        if (!userInfor){
            return <></>
        }
        let name = "Bạn"
        if (!userInfor?.isMe){
            name = userInfor.fullName
        }

        return (
            <p className="text-quinary text-sm">
                { name } đã tạo phòng này vào lúc { formatDatetime(createdAt) }
            </p>
        )
    }

    return (
        <div className="h-full flex flex-col chat">
            <div className="content-chat overflow-auto mb-2">
                <div className=" px-4 flex flex-col justify-end space-y-2 mt-8">
                    <div className="flex-center flex-col mb-6">
                        <Avatar
                            alt="Remy Sharp"
                            className="border-border border-2"
                            src={ avatar }
                            sx={ { width: 120, height: 120 } }
                        />

                        <p className="font-semibold mt-2">{ name }</p>

                        { showInforGroup() }
                    </div>

                    { messengersWithUserInfor.map((mess) => (
                        <MessengerCard { ...mess } key={ mess.id } />
                    )) }

                    <div ref={ endMessengerRef } />
                </div>
            </div>

            <Input id={ id } />
        </div>
    )
}

export default Content
