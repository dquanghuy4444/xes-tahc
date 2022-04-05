import React from "react"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import AvatarWithOnline from "components/AvatarWithOnline"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"
import { getTimePeriodToPresent } from "utils/get-time-period-to-present"

const Header = () => {
    const navigate = useNavigate()

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setToggleInforBarDisplayed = useStore((state) => state.setToggleInforBarDisplayed)
    const handleRedirectToDashboard = () => {
        navigate("/", { replace: true })
    }

    return (
        <div className="border-border border-b-2 min-h-[64px] px-6 flex items-center">
            <div
                className={ `h-full w-8 tablet:hidden cursor-pointer` }
                onClick={ handleRedirectToDashboard }
            >
                <ArrowBackIcon />
            </div>

            <AvatarWithOnline
                alt="Remy Sharp"
                isOnline={ chatRoomInfor?.isOnline || false }
                src={ chatRoomInfor?.avatar || "" }
                sx={ { width: 48, height: 48 } }
            />

            <div className="ml-4">
                <p className="font-semibold text-[19px]">{ chatRoomInfor?.name }</p>

                {
                    !chatRoomInfor?.isGroup && (
                        <p className="text-sm text-quinary">
                            {
                                chatRoomInfor.isOnline ? "Đang hoạt động" : `Hoạt động ${getTimePeriodToPresent(chatRoomInfor?.lastTimeOnline)} trước`
                            }
                        </p>
                    )
                }
            </div>

            { chatRoomInfor?.isGroup && (
                <Avatar
                    sx={ { bgcolor: blue[50], cursor: "pointer", width: 36, height: 36, ml: "auto" } }
                    onClick={ () => setToggleInforBarDisplayed() }
                >
                    <MoreHorizIcon sx={ { fontSize: 20, color: "black" } } />
                </Avatar>
            ) }
        </div>
    )
}

export default Header
