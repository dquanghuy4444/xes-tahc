import React from "react"

import LogoutIcon from "@mui/icons-material/Logout"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"

const Header = () => {
    const navigate = useNavigate()

    const myInfor = useStore((state) => state.myInfor)

    const handleSignOut = () => {
        localStorage.removeItem("token")

        navigate("/login", { replace: true })
    }

    return (
        <header className="min-h-[68px] border-border border-b-2 hidden tablet:flex items-center justify-between px-4 tablet:px-6">
            <Avatar src={ myInfor?.avatar } sx={ { width: 48, height: 48 } } />

            <Avatar sx={ { bgcolor: blue[800], cursor: "pointer" } } onClick={ handleSignOut }>
                <LogoutIcon sx={ { fontSize: 24 } } />
            </Avatar>
        </header>
    )
}

export default Header
