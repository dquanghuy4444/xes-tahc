import { ENUM_MESSAGE_TYPE , ENUM_MESSAGE_INFO_TYPE } from "constants"

import React from "react"

import CircleIcon from "@mui/icons-material/Circle"
import Avatar from "@mui/material/Avatar"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const ChatRoomCard = ({ info }) => {
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
        if(lastMessengerInfor.type === ENUM_MESSAGE_TYPE.TEXT){
            return `${lastMessengerInfor.userName} : ${lastMessengerInfor.content}`
        }
        if(lastMessengerInfor.type === ENUM_MESSAGE_TYPE.INFO){
            if(lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                return `${lastMessengerInfor.userName} đã đổi tên nhóm`
            }
            if(lastMessengerInfor.info.type === ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER){
                return `${lastMessengerInfor.userName} đã thêm thành viên`
            }
        }

        return ""
    }

    return (
        <div
            className="flex cursor-pointer hover:bg-hover p-2 rounded-md items-center"
            onClick={ handleRedirectToChatRoom }
        >
            <Avatar alt="Remy Sharp" src={ avatar } sx={ { width: 48, height: 48 } } />

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
