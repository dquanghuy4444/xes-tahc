import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React from "react"

import CircleIcon from "@mui/icons-material/Circle"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import Avatar from "@mui/material/Avatar"
import AvatarWithOnline from "components/AvatarWithOnline"
import { MY_NAME } from "configs"
import { getTimePeriodToPresent } from "utils/get-time-period-to-present"

const ChatRoomCard = ({ info, isActive, onClick }) => {
    const { lastMessengerInfor, avatar, name } = info

    const showTimePeriodToPresent = () => {
        if (!lastMessengerInfor){
            return <></>
        }

        const { createdAt } = lastMessengerInfor
        const str = getTimePeriodToPresent(createdAt)

        return <p className="text-xs text-quinary">{ str }</p>
    }

    const getContentLastMessenger = () => {
        if (!lastMessengerInfor?.type){
            return "Chưa có tin nhắn nào"
        }
        if (lastMessengerInfor.type === ENUM_MESSAGE_TYPE.TEXT){
            return `${
                lastMessengerInfor.userName === MY_NAME || info.isGroup
                    ? `${lastMessengerInfor.userName} : `
                    : ""
            }${lastMessengerInfor.content}`
        }
        if (lastMessengerInfor.type === ENUM_MESSAGE_TYPE.IMAGE){
            return `${
                lastMessengerInfor.userName === MY_NAME || info.isGroup
                    ? `${lastMessengerInfor.userName} : `
                    : ""
            }đã tải hình ảnh`
        }
        if (lastMessengerInfor.type === ENUM_MESSAGE_TYPE.INFO){
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                return `${lastMessengerInfor.userName} đã đổi tên nhóm`
            }
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_AVATAR_GROUP){
                return `${lastMessengerInfor.userName} đã đổi ảnh đại diện nhóm`
            }
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER){
                return `${lastMessengerInfor.userName} đã thêm thành viên`
            }
            if (lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT){

                if (lastMessengerInfor.createdBy === lastMessengerInfor.info.victim){
                    return `${lastMessengerInfor?.info.victimName} đã tự ra khỏi nhóm`
                }

                return `${lastMessengerInfor.userName} đã kick ${
                    lastMessengerInfor?.info.victimName || "thành viên"
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
            onClick={ onClick }
        >
            <div className="relative">
                { info.isGroup ? (
                    <>
                        <Avatar alt="Remy Sharp" src={ avatar } sx={ { width: 52, height: 52 } } />

                        <div className="absolute bottom-0 -left-1">
                            <Avatar
                                alt="Remy Sharp"
                                sx={ { width: 20, height: 20, bgcolor: "white" } }
                            >
                                <PeopleAltIcon className="text-quinary" sx={ { fontSize: 14 } } />
                            </Avatar>
                        </div>
                    </>
                ) : (
                    <AvatarWithOnline
                        isOnline={ info.isOnline }
                        src={ avatar }
                        sx={ { width: 52, height: 52 } }
                    />
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
                        } text-sm text-overflow laptop:max-w-[160px] tablet:max-w-[120px] max-w-[180px]` }
                    >
                        { getContentLastMessenger() }
                    </p>

                    { showTimePeriodToPresent() }
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
