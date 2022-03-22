import React from "react"

import Avatar from "@mui/material/Avatar"

const ChatRoomcard = () => {
    return (
        <div className="flex space-x-4 cursor-pointer hover:bg-hover p-2 rounded-md items-center">
            <Avatar
                alt="Remy Sharp"
                src="https://thao68.com/wp-content/uploads/2022/02/avatar-hero-team-15.jpg"
                sx={ { width: 52, height: 52 } }
            />

            <div>
                <p className="font-semibold text-[17px] text-overflow w-[200px]">huy dz</p>

                <p className="text-quinary text-sm text-overflow w-[160px]">huyhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</p>
            </div>
        </div>
    )
}

export default ChatRoomcard
