
import React, { useState } from "react"

import AddReactionIcon from "@mui/icons-material/AddReaction"
import EditIcon from "@mui/icons-material/Edit"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { Stack } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { MY_NAME } from "configs"
import { useStore } from "store"
import { formatDatetime } from "utils/datetime"

import ModalAddMember from "./ModalAddMember"
import ModalChangeName from "./ModalChangeName"
import ModalShowMembers from "./ModalShowMembers"

export default function FirstMessenger(){
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)

    const [openModalChangeName, setOpenModalChangeName] = useState(false)
    const [openModalAddMem, setOpenModalAddMem] = useState(false)
    const [openModalShowMembers, setOpenModalShowMembers] = useState(false)

    if (!chatRoomInfor){
        return <></>
    }

    const { avatar, userInfors, createdBy, isGroup, createdAt, name } = chatRoomInfor

    const showInforGroup = () => {
        if (!isGroup){
            return <></>
        }

        const userInfor = userInfors.find((info) => info.id === createdBy)
        if (!userInfor){
            return <></>
        }
        let name = MY_NAME
        if (!userInfor?.isMe){
            name = userInfor.fullName
        }

        return (
            <>
                <ModalChangeName open={ openModalChangeName } setOpen={ setOpenModalChangeName } />

                <ModalAddMember open={ openModalAddMem } setOpen={ setOpenModalAddMem } />

                <ModalShowMembers open={ openModalShowMembers } setOpen={ setOpenModalShowMembers } />

                <div>
                    <p className="text-quinary text-sm text-center px-6">
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
                            sx={ { minWidth: 80 } }
                            onClick={ () => setOpenModalAddMem(true) }
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
                            sx={ { minWidth: 80 } }
                            onClick={ () => setOpenModalChangeName(true) }
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
                            sx={ { minWidth: 80 } }
                            onClick={ () => setOpenModalShowMembers(true) }
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
            </>
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
