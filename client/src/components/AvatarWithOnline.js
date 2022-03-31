import * as React from "react"

import Avatar from "@mui/material/Avatar"
import Badge from "@mui/material/Badge"
import { styled } from "@mui/material/styles"

export default function AvatarWithOnline({ isOnline, ...props }){
    const StyledBadge = styled(Badge)(({ theme }) => ({
        "& .MuiBadge-badge": {
            backgroundColor : isOnline ? "#44b700" : "#8d7c7c",
            color           : isOnline ? "#44b700" : "#8d7c7c",
            boxShadow       : `0 0 0 3px ${isOnline ? theme.palette.background.paper : "#8d7c7c"}`,
            "&::after"      : {
                position     : "absolute",
                top          : 0,
                left         : 0,
                width        : "100%",
                height       : "100%",
                borderRadius : "50%",
                animation    : isOnline ? "ripple 1.2s infinite ease-in-out" : "",
                border       : "1px solid currentColor",
                content      : '""'
            }
        },
        "@keyframes ripple": {
            "0%": {
                transform : "scale(.8)",
                opacity   : 1
            },
            "100%": {
                transform : "scale(2.4)",
                opacity   : 0
            }
        }
    }))

    return (
        <StyledBadge
            anchorOrigin={ { vertical: "bottom", horizontal: "left" } }
            overlap="circular"
            variant="dot"
        >
            <Avatar { ...props } />
        </StyledBadge>
    )
}
