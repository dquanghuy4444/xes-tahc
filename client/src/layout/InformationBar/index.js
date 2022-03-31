import { ENUM_UPDATE_MEMBER_TYPE, ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React, { useState, useEffect } from "react"

import AddIcon from "@mui/icons-material/Add"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import LogoutIcon from "@mui/icons-material/Logout"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import { Avatar } from "@mui/material"
import ConfirmModal from "components/ConfirmModal"
import { SOCKET_EVENT_NAMES } from "configs"
import { ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import { putData, postData } from "helper"
import ModalAddMember from "pages/ChatRoom/Content/FirstMessenger/ModalAddMember"
import ModalChangeName from "pages/ChatRoom/Content/FirstMessenger/ModalChangeName"
import ModalShowMembers from "pages/ChatRoom/Content/FirstMessenger/ModalShowMembers"
import { useStore } from "store"

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

const InformationBar = ({className}) => {
    const [openModalChangeName, setOpenModalChangeName] = useState(false)
    const [openModalAddMem, setOpenModalAddMem] = useState(false)
    const [openShowMemModal, setOpenShowMemModal] = useState(false)
    const [openModalShowMembers, setOpenModalShowMembers] = useState(false)

    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)
    const socket = useStore((state) => state.socket)
    const setIsInforBarDisplayed = useStore((state) => state.setIsInforBarDisplayed)

    useEffect(() => {
        return () => {
            setIsInforBarDisplayed(false)
        }
    }, [])

    if (!chatRoomInfor){
        return <></>
    }

    const { avatar, name, id } = chatRoomInfor

    const handleRemoveUser = async() => {
        const res = await putData(ChatRoomApiPath.member(id), {
            type    : ENUM_UPDATE_MEMBER_TYPE.REMOVE,
            userIds : [myInfor.id]
        })

        if (!res){
            return
        }

        const mess = await postData(MessengerApiPath.index, {
            content : "",
            type    : ENUM_MESSAGE_TYPE.INFO,
            info    : {
                type   : ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT,
                victim : myInfor.id
            },
            chatRoomId: chatRoomInfor.id
        })

        setIsInforBarDisplayed(false)

        socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
            ...mess,
            userIds: [
                ...chatRoomInfor.userInfors.filter((info) => info.stillIn).map((info) => info.id)
            ],
            userInfor : myInfor,
            chatRoom  : {
                id     : chatRoomInfor.id,
                name   : chatRoomInfor.name,
                avatar : chatRoomInfor.avatar
            }
        })
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

            <div className={ `min-w-[360px] laptop:border-border laptop:border-l-2  p-4 ${className}` }>
                <div className="laptop:hidden" onClick={ () => setIsInforBarDisplayed(false) }>
                    <ArrowBackIcon />
                </div>

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
