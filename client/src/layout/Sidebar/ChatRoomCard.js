import React from "react"

import Avatar from "@mui/material/Avatar"

const ChatRoomCard = ({ info }) => {
    console.log(info)

    return (
        <div className="flex space-x-4 cursor-pointer hover:bg-hover p-2 rounded-md items-center">
            <Avatar
                alt="Remy Sharp"
                src={ info.avatar }
                sx={ { width: 52, height: 52 } }
            />

            <div>
                <p className="font-semibold text-[17px] text-overflow w-[200px]">
                    { info.name }
                </p>

                <p className="text-quinary text-sm text-overflow w-[160px]">
                    huyhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
                </p>
            </div>
        </div>
    )
}

export default ChatRoomCard
