import React from "react"

import CircleIcon from "@mui/icons-material/Circle"
import Avatar from "@mui/material/Avatar"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const ChatRoomCard = ({ info }) => {
    const { lastMessageInfor, avatar, name, id } = info

    const navigate = useNavigate()

    const getTimePeriodToPresent = () => {
        if (!lastMessageInfor){
            return <></>
        }

        const { createdAt } = lastMessageInfor
        let str = moment(createdAt).fromNow()
        str = str.replace("minutes ago", "phút")

        return <p className="text-xs text-quinary">{ str }</p>
    }

    const handleRedirectToChatRoom = () => {
        navigate(`/room/${id}`, { replace: true })
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
                        lastMessageInfor?.hasRead ? "text-quinary" : "font-semibold"
                    } text-overflow` }
                >
                    { name }
                </p>

                <div className="flex space-x-4 items-center">
                    <p
                        className={ `${
                            lastMessageInfor?.hasRead ? "text-quinary" : "font-semibold"
                        } text-sm text-overflow max-w-[160px]` }
                    >
                        { lastMessageInfor
                            ? `${lastMessageInfor.userName} : ${lastMessageInfor.content}`
                            : "Chưa có tin nhắn nào" }
                    </p>

                    { getTimePeriodToPresent() }
                </div>
            </div>

            { !lastMessageInfor?.hasRead && (
                <div className="ml-auto">
                    <CircleIcon color="primary" sx={ { fontSize: 16 } } />
                </div>
            ) }
        </div>
    )
}

export default ChatRoomCard
