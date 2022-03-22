import React from "react"

import LogoutIcon from "@mui/icons-material/Logout"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()

    const handleSignOut = () => {
        localStorage.removeItem("token")

        navigate("/login", { replace: true })
    }

    return (
        <header className="min-h-[68px] border-border border-b-2 flex items-center justify-between px-6">
            <div />

            <Avatar sx={ { bgcolor: blue[800], cursor: "pointer" } } onClick={ handleSignOut }>
                <LogoutIcon sx={ { fontSize: 24 } } />
            </Avatar>
        </header>
    )
}

export default Header
