import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React from "react"

import Box from "@mui/material/Box"
import { blue, teal } from "@mui/material/colors"
import { MY_NAME } from "configs"

export default function MessengerCard({ userInfor, content, type, info, attachments, createdBy }){
    const showContent = () => {
        if (type === ENUM_MESSAGE_TYPE.TEXT){
            return (
                <Box
                    className={ `rounded-3xl py-2 px-4 w-fit max-w-2/3 tablet:max-w-[48%] text-overflow ${
                        userInfor?.isMe ? `ml-auto mr-0 text-white` : ""
                    }` }
                    sx={ { bgcolor: userInfor?.isMe ? blue["A400"] : teal[50] } }
                >
                    <p className="text-[15px] text-overflow leading-5">{ content }</p>
                </Box>
            )
        }
        if (type === ENUM_MESSAGE_TYPE.INFO){
            let str = MY_NAME
            if (!userInfor?.isMe && userInfor?.fullName){
                str = userInfor.fullName
            }

            if (info.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                str += " đã đổi tên nhóm thành "
            }
            if (info.type === ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER){
                str += ` đã thêm ${
                    info?.userInfor?.isMe ? MY_NAME : info?.userInfor?.fullName || "thành viên"
                }`
            }
            if (info.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT){
                if (createdBy === info.victim){
                    str += ` đã tự ra khỏi nhóm`
                } else {
                    str += ` đã kick ${
                        info?.userInfor?.isMe ? MY_NAME : info?.userInfor?.fullName
                    } ra khỏi nhóm`
                }
            }

            return (
                <Box className="py-1">
                    <p className="text-[15px] text-overflow text-quinary text-sm leading-5 text-center">
                        { str + content }
                    </p>
                </Box>
            )
        }
        if (type === ENUM_MESSAGE_TYPE.IMAGE){
            return (
                <Box
                    className={ `py-1 max-w-2/3 laptop:max-w-[48%] flex gap-2 flex-wrap ${
                        userInfor?.isMe ? `ml-auto mr-0 justify-end` : ""
                    }` }
                >
                    { attachments.map((att) => (
                        <div className="rounded-lg overflow-hidden w-max" key={ att.path }>
                            <img alt={ "" } className=" h-[68px] tablet:h-[88px] w-full" src={ att.path } />
                        </div>
                    )) }
                </Box>
            )
        }

        return <></>
    }

    return <>{ showContent() }</>
}
