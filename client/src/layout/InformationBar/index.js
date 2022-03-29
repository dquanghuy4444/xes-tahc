import {
    ENUM_UPDATE_MEMBER_TYPE,
    ENUM_MESSAGE_TYPE,
    ENUM_MESSAGE_INFO_TYPE,
    ENUM_STATUS_SET_STATE_ZUSTAND
} from "constants"

import React, { useState } from "react"

import AddIcon from "@mui/icons-material/Add"
import LogoutIcon from "@mui/icons-material/Logout"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Avatar from "@mui/material/Avatar"
import ConfirmModal from "components/ConfirmModal"
import { ChatRoomApiPath } from "configs/api-paths"
import { putData } from "helper"
import ModalAddMember from "pages/ChatRoom/Content/FirstMessenger/ModalAddMember"
import ModalChangeName from "pages/ChatRoom/Content/FirstMessenger/ModalChangeName"
import ModalShowMembers from "pages/ChatRoom/Content/FirstMessenger/ModalShowMembers"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"
const NavItem = ({ onClick, icon, children, className = "" }) => {
    return (
        <div
            className={ `flex cursor-pointer p-3 hover:bg-quinary--light rounded-lg ${className}` }
            onClick={ onClick }
        >
            <div className="w-9"> { React.cloneElement(icon, { fontSize: "small" }) }</div>

            <p className="font-semibold text-[15px]">{ children }</p>
        </div>
    )
}

const InformationBar = () => {
    const navigate = useNavigate()

    const [openModalChangeName, setOpenModalChangeName] = useState(false)
    const [openModalAddMem, setOpenModalAddMem] = useState(false)
    const [openShowMemModal, setOpenShowMemModal] = useState(false)
    const [openModalShowMembers, setOpenModalShowMembers] = useState(false)

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomDescriptions = useStore((state) => state.setChatRoomDescriptions)
    const myInfor = useStore((state) => state.myInfor)
    const setIsInforBarDisplayed = useStore((state) => state.setIsInforBarDisplayed)

    if (!chatRoomInfor){
        return <></>
    }

    const { avatar, userInfors, createdBy, isGroup, createdAt, name, id } = chatRoomInfor

    const handleRemoveUser = async() => {
        const res = await putData(ChatRoomApiPath.member(id), {
            type    : ENUM_UPDATE_MEMBER_TYPE.REMOVE,
            userIds : [myInfor.id]
        })

        if (!res){
            return
        }

        setChatRoomDescriptions(
            [
                {
                    id: chatRoomInfor.id
                }
            ],
            ENUM_STATUS_SET_STATE_ZUSTAND.REMOVE
        )
        showNotification("success", `Bạn đã thoát khỏi nhóm ${chatRoomInfor.name}`)
        setIsInforBarDisplayed()
        navigate(`/`, { replace: true })
    }

    return (
        <>
            <ConfirmModal
                close={ () => {
                    setOpenShowMemModal(false)
                } }
                content={ "Bạn có chắc muốn thoát khỏi nhóm này không ?" }
                handle={ handleRemoveUser }
                open={ openShowMemModal }
                title={ "Thoát khỏi nhóm" }
            />

            <ModalChangeName open={ openModalChangeName } setOpen={ setOpenModalChangeName } />

            <ModalAddMember open={ openModalAddMem } setOpen={ setOpenModalAddMem } />

            <ModalShowMembers open={ openModalShowMembers } setOpen={ setOpenModalShowMembers } />

            <div className="min-w-[360px] border-border border-l-2  p-4">
                <div className="flex-center flex-col mb-6 mt-4">
                    <Avatar
                        alt="Remy Sharp"
                        className="border-border border-2"
                        src={ avatar }
                        sx={ { width: 120, height: 120 } }
                    />

                    <p className="font-semibold mt-2">{ name }</p>
                </div>

                <NavItem icon={ <PeopleAltIcon /> } onClick={ () => setOpenModalShowMembers(true) }>
                    Thành viên
                </NavItem>

                <NavItem icon={ <ModeEditIcon /> } onClick={ () => setOpenModalChangeName(true) }>
                    Đổi tên nhóm
                </NavItem>

                <NavItem icon={ <AddIcon /> } onClick={ () => setOpenModalAddMem(true) }>
                    Thêm thành viên
                </NavItem>

                <NavItem icon={ <LogoutIcon /> } onClick={ () => setOpenShowMemModal(true) }>
                    Rời khỏi nhóm
                </NavItem>
            </div>
        </>
    )
}

export default InformationBar
