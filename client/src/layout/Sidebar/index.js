import { ENUM_MESSAGE_INFO_TYPE, ENUM_STATUS_SET_STATE_ZUSTAND } from "constants"

import React, { useState } from "react"

import AddIcon from "@mui/icons-material/Add"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import { SOCKET_EVENT_NAMES } from "configs"
import { ChatRoomApiPath } from "configs/api-paths"
import { fetchData } from "helper"
import useFetchDataNoSave from "hooks/useFetchDataNoSave"
import useSocketOn from "hooks/useSocketOn"
import { useParams, useNavigate } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

import ChatRoomCard from "./ChatRoomCard"
import ModalCreateRoom from "./ModalCreateRoom"
import SearchChatRoomInput from "./SearchChatRoomInput"

const Sidebar = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const [openModalCreateRoom, setOpenModalCreateRoom] = useState(false)

    const myInfor = useStore((state) => state.myInfor)
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const setChatRoomInfor = useStore((state) => state.setChatRoomInfor)
    const chatRoomDescriptions = useStore((state) => state.chatRoomDescriptions)
    const setChatRoomDescriptions = useStore((state) => state.setChatRoomDescriptions)

    useFetchDataNoSave(
        ChatRoomApiPath.myChatRoom,
        (res) => {
            if (!res){
                return
            }
            const temp = res.sort((a, b) => {
                if (!a.lastMessengerInfor){
                    return 1
                }

                if (b.lastMessengerInfor){
                    return Date(a.lastMessengerInfor.createdAt).localeCompare(
                        Date(b.lastMessengerInfor.createdAt)
                    )
                }

                return -1
            })

            setChatRoomDescriptions(temp, ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW)
        },
        []
    )

    useSocketOn(
        SOCKET_EVENT_NAMES.SERVER_SOCKET.SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION,
        async(data) => {
            if (
                data?.lastMessengerInfor?.info?.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT &&
                data?.lastMessengerInfor?.info?.victim === myInfor.id
            ){
                setChatRoomDescriptions(
                    [
                        {
                            id: data.id
                        }
                    ],
                    ENUM_STATUS_SET_STATE_ZUSTAND.REMOVE
                )

                showNotification("success", `Bạn đã thoát khỏi nhóm ${chatRoomInfor.name}`)

                if (data.id === chatRoomInfor.id){
                    navigate(`/`, { replace: true })
                }

                return
            }
            if (chatRoomInfor.id === data.id){
            }
            if (data?.lastMessengerInfor?.info?.type === ENUM_MESSAGE_INFO_TYPE.CHANGE_NAME_GROUP){
                setChatRoomInfor({
                    name: data.name
                })
            } else if (
                data?.lastMessengerInfor?.info?.type === ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER ||
                data?.lastMessengerInfor?.info?.type === ENUM_MESSAGE_INFO_TYPE.LEAVE_CHAT
            ){
                const res = await fetchData(ChatRoomApiPath.chatRoomDetail(id))
                setChatRoomInfor(
                    {
                        ...res,
                        userInfors: [
                            ...res.userInfors,
                            {
                                ...myInfor,
                                userId  : myInfor.id,
                                stillIn : true,
                                isMe    : true
                            }
                        ]
                    },
                    ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW
                )
            }

            setChatRoomDescriptions([data])
        }
    )

    return (
        <>
            <ModalCreateRoom open={ openModalCreateRoom } setOpen={ setOpenModalCreateRoom } />

            <section className="hidden tablet:flex flex-col tablet:w-[320px] laptop:w-[360px] h-full border-border border-r-2">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold	text-lg	">Messengers</p>

                        <Avatar
                            sx={ { bgcolor: blue[50], cursor: "pointer", width: 36, height: 36 } }
                            onClick={ () => setOpenModalCreateRoom(true) }
                        >
                            <AddIcon sx={ { fontSize: 20, color: "black" } } />
                        </Avatar>
                    </div>

                    <SearchChatRoomInput />
                </div>

                <div className="overflow-auto px-4 pb-2 ">
                    { chatRoomDescriptions?.length > 0 ? (
                        chatRoomDescriptions.map((item) => (
                            <ChatRoomCard
                                info={ item }
                                isActive={ item.id === id }
                                key={ item.id }
                                roomIsGroup={ item.isGroup }
                                userInfors={ chatRoomInfor?.userInfors || [] }
                            />
                        ))
                    ) : (
                        <p className="text-center mt-4 font-semibold text-lg">
                            Bạn chưa có cuộc hội thoại nào
                        </p>
                    ) }
                </div>
            </section>
        </>
    )
}

export default Sidebar
