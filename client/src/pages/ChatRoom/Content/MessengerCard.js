import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React from "react"

import Box from "@mui/material/Box"
import { blue, teal } from "@mui/material/colors"

export default function MessengerCard({ userInfor, content, type, info }){
    console.log(userInfor);
    const showContent = () => {
        if (type === ENUM_MESSAGE_TYPE.TEXT){
            return (
                <Box
                    className={ `rounded-3xl py-2 px-4 w-fit max-w-[48%] text-overflow ${
                        userInfor?.isMe ? `ml-auto mr-0 text-white` : ""
                    }` }
                    sx={ { bgcolor: userInfor?.isMe ? blue["A400"] : teal[50] } }
                >
                    <p className="text-[15px] text-overflow leading-5">{ content }</p>
                </Box>
            )
        }
        if (type === ENUM_MESSAGE_TYPE.INFO){
            let str = "Bạn"
            if(!userInfor?.isMe && userInfor?.fullName){
                str = userInfor.fullName
            }

            if (info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                str += " đã đổi tên nhóm thành "
            }

            return (
                <Box className="py-1">
                    <p className="text-[15px] text-overflow text-quinary text-sm leading-5 text-center">
                        { str + content }
                    </p>
                </Box>
            )
        }

        return <></>
    }

    return <>{ showContent() }</>
}
