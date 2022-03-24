import React from "react"

import AddReactionIcon from "@mui/icons-material/AddReaction"
import EditIcon from "@mui/icons-material/Edit"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { Stack } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { useStore } from "store"
import { formatDatetime } from "utils/datetime"

export default function FirstMessenger(){
    const roomInfor = useStore((state) => state.chatRoomInfor)

    if(!roomInfor){
        return <></>
    }

    const { avatar, userInfors, createdBy, isGroup, createdAt, name } = roomInfor

    const showInforGroup = () => {
        if (!isGroup){
            return <></>
        }

        const userInfor = userInfors.find((info) => info.id === createdBy)
        if (!userInfor){
            return <></>
        }
        let name = "Bạn"
        if (!userInfor?.isMe){
            name = userInfor.fullName
        }

        return (
            <div>
                <p className="text-quinary text-sm">
                    { name } đã tạo phòng này vào lúc { formatDatetime(createdAt) }
                </p>

                <Stack
                    direction="row" justifyContent="center" spacing={ 4 }
                    sx={ { mt: 2 } }
                >
                    <Stack
                        alignItems="center"
                        direction="column"
                        justifyContent="center"
                        sx={ { minWidth: 100 } }
                    >
                        <Avatar
                            sx={ { bgcolor: blue[50], width: 48, height: 48, cursor: "pointer" } }
                        >
                            <AddReactionIcon />
                        </Avatar>

                        <p>Thêm</p>
                    </Stack>

                    <Stack
                        alignItems="center"
                        direction="column"
                        justifyContent="center"
                        sx={ { minWidth: 100 } }
                    >
                        <Avatar
                            sx={ { bgcolor: blue[50], width: 48, height: 48, cursor: "pointer" } }
                        >
                            <EditIcon />
                        </Avatar>

                        <p>Đổi tên</p>
                    </Stack>

                    <Stack
                        alignItems="center"
                        direction="column"
                        justifyContent="center"
                        sx={ { minWidth: 100 } }
                    >
                        <Avatar
                            sx={ { bgcolor: blue[50], width: 48, height: 48, cursor: "pointer" } }
                        >
                            <PeopleAltIcon />
                        </Avatar>

                        <p>Thành viên</p>
                    </Stack>
                </Stack>
            </div>
        )
    }

    return (
        <div className="flex-center flex-col mb-6">
            <Avatar
                alt="Remy Sharp"
                className="border-border border-2"
                src={ avatar }
                sx={ { width: 120, height: 120 } }
            />

            <p className="font-semibold mt-2">{ name }</p>

            { showInforGroup() }
        </div>
    )
}
