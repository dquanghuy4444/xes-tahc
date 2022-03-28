import { ENUM_UPDATE_MEMBER_TYPE, ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React, { useState } from "react"

import LogoutIcon from "@mui/icons-material/Logout"
import { Avatar, Stack } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import { blue } from "@mui/material/colors"
import ConfirmModal from "components/ConfirmModal"
import Modal from "components/Modal"
import { UserApiPath, ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import { fetchData, putData, postData } from "helper"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

const ModalShowMembers = ({ open, setOpen }) => {
    const navigate = useNavigate()

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const setMessengers = useStore((state) => state.setMessengers)

    const [openShowMemModal, setOpenShowMemModal] = useState(false)
    const [removeUserInfor, setRemoveUserInfor] = useState("")

    const handleRemoveUser = async() => {
        const res = await putData(ChatRoomApiPath.member(chatRoomInfor.id), {
            type    : ENUM_UPDATE_MEMBER_TYPE.REMOVE,
            userIds : [removeUserInfor.userId]
        })

        if(!res){
            return
        }

        if(removeUserInfor?.isMe){
            navigate(`/`, { replace: true })
        }
    }

    const showMembers = () => {
        if (chatRoomInfor.userInfors.length === 0) return <></>

        return (
            <div className="max-h-[240px] overflow-auto">
                { chatRoomInfor.userInfors
                    .filter((info) => info.stillIn)
                    .map((info) => {
                        return (
                            <Stack
                                alignItems="center"
                                className="hover:bg-quinary--light py-2 px-4"
                                direction="row"
                                key={ info?.id }
                            >
                                <Avatar src={ info?.avatar } />

                                <p className="ml-4">{ info?.fullName }</p>

                                <Avatar
                                    sx={ {
                                        bgcolor : blue[50],
                                        ml      : "auto",
                                        cursor  : "pointer",
                                        width   : 30,
                                        height  : 30
                                    } }
                                    onClick={ () => {
                                        setRemoveUserInfor(info)
                                        setOpenShowMemModal(true)
                                    } }
                                >
                                    <LogoutIcon sx={ { color: "black ", fontSize: 16 } } />
                                </Avatar>
                            </Stack>
                        )
                    }) }
            </div>
        )
    }

    return (
        <Modal close={ () => setOpen(false) } open={ open }>
            <ConfirmModal
                close={ () => {
                    setOpenShowMemModal(false)
                } }
                content={
                    removeUserInfor?.isMe
                        ? "Bạn có chắc muốn thoát khỏi nhóm này không ?"
                        : "Bạn có chắc muốn cho thành viên này ra khỏi nhóm không ?"
                }
                handle={ handleRemoveUser }
                open={ openShowMemModal }
                title={
                    removeUserInfor?.isMe
                        ? "Thoát khỏi nhóm"
                        : `Xóa thành viên ${removeUserInfor?.fullName || ""}`
                }
            />

            <div className="w-[500px]">
                <div className="relative py-4 border-b-2 border-border">
                    <p className="text-center font-semibold text-xl">Thành viên</p>
                </div>

                { showMembers() }
            </div>
        </Modal>
    )
}

export default ModalShowMembers
