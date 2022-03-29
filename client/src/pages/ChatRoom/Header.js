import React from "react"

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { useStore } from "store"
const Header = () => {
    const roomInfor = useStore((state) => state.chatRoomInfor)
    const setIsInforBarDisplayed = useStore((state) => state.setIsInforBarDisplayed)

    return (
        <div className="border-border border-b-2 min-h-[64px] px-4 flex items-center">
            <Avatar alt="Remy Sharp" src={ roomInfor?.avatar || "" } sx={ { width: 48, height: 48 } } />

            <p className="ml-4 font-semibold text-[19px]">{ roomInfor?.name }</p>

            <Avatar
                sx={ { bgcolor: blue[50], cursor: "pointer", width: 36, height: 36 , ml: "auto" } }
                onClick={ () => setIsInforBarDisplayed() }
            >
                <MoreHorizIcon sx={ { fontSize: 20, color: "black" } } />
            </Avatar>
        </div>
    )
}

export default Header
