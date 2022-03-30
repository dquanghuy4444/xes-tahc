import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React from "react"

import CircleIcon from "@mui/icons-material/Circle"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import Avatar from "@mui/material/Avatar"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const ChatRoomCard = ({ info, isActive, userInfors, roomIsGroup }) => {
    const { lastMessengerInfor, avatar, name, id } = info

    const navigate = useNavigate()

    const getTimePeriodToPresent = () => {
        if (!lastMessengerInfor){
            return <></>
        }

        const { createdAt } = lastMessengerInfor
        let str = moment(createdAt).fromNow()
        str = str.replace("minutes ago", "phút")

        return <p className="text-xs text-quinary">{ str }</p>
    }

    const handleRedirectToChatRoom = () => {
        navigate(`/room/${id}`, { replace: true })
    }

    const getContentLastMessenger = () => {
        if (!lastMessengerInfor){
            return "Chưa có tin nhắn nào"
        }
        if (lastMessengerInfor.type === ENUM_MESSAGE_TYPE.TEXT){
            return `${lastMessengerInfor.userName} : ${lastMessengerInfor.content}`
        }
        if (lastMessengerInfor.type === ENUM_MESSAGE_TYPE.INFO){
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                return `${lastMessengerInfor.userName} đã đổi tên nhóm`
            }
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER){
                return `${lastMessengerInfor.userName} đã thêm thành viên`
            }
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT){
                const victimInfor = userInfors.find((u) => u.id === lastMessengerInfor.info.victim)

                if (lastMessengerInfor.createdBy === lastMessengerInfor.info.victim){
                    return `${victimInfor?.fullName} đã tự ra khỏi nhóm`
                }

                return `${lastMessengerInfor.userName} đã kick ${
                    victimInfor?.fullName || "thành viên"
                } ra khỏi nhóm`
            }
        }

        return ""
    }

    return (
        <div
            className={ `flex cursor-pointer p-2 rounded-md items-center ${
                isActive ? "bg-hover" : "hover:bg-hover"
            }` }
            onClick={ handleRedirectToChatRoom }
        >
            <div className="relative">
                <Avatar alt="Remy Sharp" src={ avatar } sx={ { width: 48, height: 48 } } />

                { roomIsGroup && (
                    <div className="absolute bottom-0 -left-1">
                        <Avatar alt="Remy Sharp" sx={ { width: 20, height: 20, bgcolor: "white" } }>
                            <PeopleAltIcon className="text-quinary" sx={ { fontSize: 14 } } />
                        </Avatar>
                    </div>
                ) }
            </div>

            <div className="ml-4">
                <p
                    className={ `${
                        lastMessengerInfor?.hasRead ? "text-quinary" : "font-semibold"
                    } text-overflow` }
                >
                    { name }
                </p>

                <div className="flex space-x-4 items-center">
                    <p
                        className={ `${
                            lastMessengerInfor?.hasRead ? "text-quinary" : "font-semibold"
                        } text-sm text-overflow max-w-[160px]` }
                    >
                        { getContentLastMessenger() }
                    </p>

                    { getTimePeriodToPresent() }
                </div>
            </div>

            { !lastMessengerInfor?.hasRead && (
                <div className="ml-auto">
                    <CircleIcon color="primary" sx={ { fontSize: 16 } } />
                </div>
            ) }
        </div>
    )
}

export default ChatRoomCard
