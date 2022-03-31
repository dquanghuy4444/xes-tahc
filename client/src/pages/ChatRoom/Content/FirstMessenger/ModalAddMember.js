import { ENUM_UPDATE_MEMBER_TYPE, ENUM_MESSAGE_TYPE, ENUM_MESSAGE_INFO_TYPE } from "constants"

import React, { useState, useEffect } from "react"

import { Avatar, Button, Stack } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import AvatarWithClose from "components/AvatarWithClose"
import Modal from "components/Modal"
import SearchInput from "components/SearchInput"
import { SOCKET_EVENT_NAMES } from "configs"
import { UserApiPath, ChatRoomApiPath, MessengerApiPath } from "configs/api-paths"
import { fetchData, putData, postData } from "helper"
import { useStore } from "store"
import { showNotification } from "utils"

const ModalAddMember = ({ open, setOpen }) => {
    const chatRoomInfor = useStore((state) => state.chatRoomInfor)
    const myInfor = useStore((state) => state.myInfor)
    const socket = useStore((state) => state.socket)

    const [search, setSearch] = useState("")
    const [suggestUsers, setSuggestUsers] = useState([])
    const [chooseUsers, setChooseUsers] = useState([])

    useEffect(() => {
        const getSuggestUsers = async() => {
            if (!open) return

            const res = await fetchData(
                UserApiPath.suggestUsers(
                    chatRoomInfor?.userInfors.filter((info) => info.stillIn).map((info) => info.id)
                )
            )

            setSuggestUsers(res)
        }

        getSuggestUsers()
    }, [open])

    const handleAddMember = async() => {
        if (chooseUsers.length === 0) return

        const res = await putData(ChatRoomApiPath.member(chatRoomInfor.id), {
            type    : ENUM_UPDATE_MEMBER_TYPE.ADD,
            userIds : chooseUsers.map((info) => info.id)
        })

        if (res){
            setOpen(false)
            setChooseUsers([])
            setSearch("")
            
            await Promise.all(
                chooseUsers.map(async(info) => {
                    const mess = await postData(MessengerApiPath.index, {
                        content : "",
                        type    : ENUM_MESSAGE_TYPE.INFO,
                        info    : {
                            type   : ENUM_MESSAGE_INFO_TYPE.ADD_MEMBER,
                            victim : info.id
                        },
                        chatRoomId: chatRoomInfor.id
                    })
                    socket.emit(SOCKET_EVENT_NAMES.CLIENT.SEND_MESSENGER, {
                        ...mess,
                        userIds: [
                            ...chatRoomInfor.userInfors
                                .filter((info) => info.stillIn)
                                .map((info) => info.id),
                            ...chooseUsers.map((info) => info.id)
                        ],
                        senderInfor : myInfor,
                        chatRoom    : {
                            id     : chatRoomInfor.id,
                            name   : chatRoomInfor.name,
                            avatar : chatRoomInfor.avatar
                        }
                    })
                })
            )

            showNotification("success", "Bạn đã thêm thành viên thành công")
        }
    }

    const showSuggestUsers = () => {
        if (suggestUsers.length === 0) return <></>

        return (
            <div className="mt-2 max-h-[240px] overflow-auto">
                { suggestUsers.map((info) => {
                    const handleChooseUser = () => {
                        if (chooseUsers.some((i) => i.id === info.id)){
                            setChooseUsers((prev) => prev.filter((i) => i.id !== info.id))

                            return
                        }

                        setChooseUsers((prev) => [...prev, info])
                    }

                    return (
                        <Stack
                            alignItems="center"
                            className="cursor-pointer hover:bg-quinary--light p-2 rounded"
                            direction="row"
                            key={ info?.id }
                            onClick={ handleChooseUser }
                        >
                            <Avatar src={ info?.avatar } />

                            <p className="ml-4">{ info?.fullName }</p>

                            <Checkbox
                                checked={ chooseUsers.some((i) => i.id === info?.id) }
                                sx={ { ml: "auto" } }
                            />
                        </Stack>
                    )
                }) }
            </div>
        )
    }

    const showChooseUsers = () => {
        return (
            <div className="h-[100px] flex items-center">
                { chooseUsers.length === 0 && (
                    <p className="text-center w-full text-quinary">Chưa chọn người nào</p>
                ) }

                { chooseUsers.map((info) => {
                    const handleUnchecked = () => {
                        setChooseUsers((prev) => prev.filter((i) => i.id !== info.id))
                    }

                    return (
                        <AvatarWithClose
                            close={ handleUnchecked }
                            key={ info.id }
                            src={ info.avatar }
                            sx={ { width: 44, height: 44 } }
                        />
                    )
                }) }
            </div>
        )
    }

    return (
        <Modal close={ () => setOpen(false) } open={ open }>
            <div className="w-[500px]">
                <div className="relative py-4 border-b-2 border-border">
                    <p className="text-center font-semibold text-xl">Thêm người</p>
                </div>

                <div className="p-4">
                    <SearchInput value={ search } onChange={ (e) => setSearch(e.target.value) } />

                    { showChooseUsers() }

                    { suggestUsers.length > 0 && <p>Gợi ý</p> }

                    <div className="max-h-[240px] overflow-auto">{ showSuggestUsers() }</div>

                    <Button
                        fullWidth
                        disabled={ chooseUsers.length === 0 }
                        sx={ { mt: 4 } }
                        variant="contained"
                        onClick={ handleAddMember }
                    >
                        Thêm người
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalAddMember
