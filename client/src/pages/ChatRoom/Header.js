import React from "react"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"

const Header = () => {
    const navigate = useNavigate()

    const roomInfor = useStore((state) => state.chatRoomInfor)
    const setToggleInforBarDisplayed = useStore((state) => state.setToggleInforBarDisplayed)

    const handleRedirectToDashboard = () => {
        navigate("/", { replace: true })

    }

    return (
        <div className="border-border border-b-2 min-h-[64px] px-4 flex items-center">
            <div className={ `h-full w-8 tablet:hidden` } onClick={ handleRedirectToDashboard }>
                <ArrowBackIcon />
            </div>

            <Avatar alt="Remy Sharp" src={ roomInfor?.avatar || "" } sx={ { width: 48, height: 48 } } />

            <p className="ml-4 font-semibold text-[19px]">{ roomInfor?.name }</p>

            <Avatar
                sx={ { bgcolor: blue[50], cursor: "pointer", width: 36, height: 36, ml: "auto" } }
                onClick={ () => setToggleInforBarDisplayed() }
            >
                <MoreHorizIcon sx={ { fontSize: 20, color: "black" } } />
            </Avatar>
        </div>
    )
}

export default Header
