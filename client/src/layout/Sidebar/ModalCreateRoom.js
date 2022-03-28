import React, { useState, useEffect } from "react"

import { Avatar, Button, Stack } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import AvatarWithClose from "components/AvatarWithClose"
import Modal from "components/Modal"
import SearchInput from "components/SearchInput"
import { SOCKET_EVENT_NAMES } from "configs"
import { UserApiPath, ChatRoomApiPath } from "configs/api-paths"
import { fetchData, postData } from "helper"
import { useNavigate } from "react-router-dom"
import { useStore } from "store"
import { showNotification } from "utils"

const ModalCreateRoom = ({ open, setOpen }) => {
    const myInfor = useStore((state) => state.myInfor)
    const socket = useStore((state) => state.socket)

    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [name, setName] = useState("")
    const [suggestUsers, setSuggestUsers] = useState([])
    const [chooseUsers, setChooseUsers] = useState([])

    useEffect(() => {
        const getSuggestUsers = async() => {
            if (!open) return

            const res = await fetchData(UserApiPath.suggestUsers([myInfor.id]))

            setSuggestUsers(res)
        }

        getSuggestUsers()
    }, [open])

    const handleCreateRoom = async() => {
        if (chooseUsers.length === 0) return

        const res = await postData(ChatRoomApiPath.index, {
            name,
            isGroup : true,
            userIds : chooseUsers.map((info) => info.id)
        })

        if (res){
            socket.emit(SOCKET_EVENT_NAMES.CLIENT.CREATE_ROOM, res)
            setName("")
            setChooseUsers([])
            setSearch("")
            showNotification("success", "Bạn đã tạo phòng thành công")
            setOpen(false)
            navigate(`/room/${res.id}`, { replace: true })
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
            <div className="h-[100px] flex items-center space-x-2">
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
                    <p className="text-center font-semibold text-xl">Tạo nhóm</p>
                </div>

                <div className="p-4">
                    <TextField
                        fullWidth
                        id="outlined-required"
                        label="Tên phòng"
                        size="small"
                        sx={ { mb: 2 } }
                        value={ name }
                        onChange={ (e) => setName(e.target.value) }
                    />

                    <SearchInput value={ search } onChange={ (e) => setSearch(e.target.value) } />

                    { showChooseUsers() }

                    { suggestUsers.length > 0 && <p>Gợi ý</p> }

                    <div className="max-h-[240px] overflow-auto">{ showSuggestUsers() }</div>

                    <Button
                        fullWidth
                        disabled={ chooseUsers.length === 0 || !name }
                        sx={ { mt: 4 } }
                        variant="contained"
                        onClick={ handleCreateRoom }
                    >
                        Tạo nhóm
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalCreateRoom
