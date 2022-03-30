import React, { useState, useEffect } from "react"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Avatar from "@mui/material/Avatar"
import SearchInput from "components/SearchInput"
import { ChatRoomApiPath } from "configs/api-paths"
import { fetchData } from "helper"
import { useNavigate } from "react-router-dom"

export default function SearchChatRoomInput(){
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [searchedRoomDescriptions, setSearchedRoomDescriptions] = useState([])

    useEffect(() => {
        const getSearchedRoomDescription = async() => {
            if (!isFocused){
                return
            }
            const res = await fetchData(ChatRoomApiPath.myChatRoomBySearch(search))

            setSearchedRoomDescriptions(res)
        }

        getSearchedRoomDescription()
    }, [search])

    useEffect(() => {
        if (!isFocused){
            setSearch("")
            setSearchedRoomDescriptions([])
        }
    }, [isFocused])

    const showChatRoomDescriptions = () => {
        if (searchedRoomDescriptions.length === 0){
            return <></>
        }

        return searchedRoomDescriptions.map((desc) => {
            const handleRedirectToChatRoom = async() => {
                if (desc.isGroup){
                    navigate(`/room/${desc.id}`)
                } else {
                    const res = await fetchData(ChatRoomApiPath.ourChatRoom(desc.id))
                    if (res){
                        navigate(`/room/${res}`)
                    }
                }

                setIsFocused(false)
            }

            return (
                <div
                    className="flex p-2 cursor-pointer items-center hover:bg-quinary--light"
                    key={ desc.id }
                    onClick={ handleRedirectToChatRoom }
                >
                    <Avatar alt="Remy Sharp" src={ desc.avatar } sx={ { width: 48, height: 48 } } />

                    <div className="ml-3">
                        <p className=" text-[15px]">{ desc.name }</p>

                        { desc.description && (
                            <p className="text-[12px]  font-sm text-quinary">{ desc.description }</p>
                        ) }
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="flex mt-4 relative">
            { isFocused && (
                <div
                    className="cursor-pointer w-10 h-auto flex-center"
                    onClick={ () => {
                        setIsFocused(false)
                    } }
                >
                    <ArrowBackIcon />
                </div>
            ) }

            <SearchInput
                value={ search }
                // onBlur={ () => {
                //     setIsFocused(false)
                //     setSearch("")
                //     setSearchedRoomDescriptions([])
                // } }
                onChange={ (e) => setSearch(e.target.value) }
                onFocus={ () => setIsFocused(true) }
            />

            { isFocused && (
                <div className="absolute top-full left-0 w-full h-[240px] bg-white shadow-secondary z-99999 overflow-auto">
                    { showChatRoomDescriptions() }
                </div>
            ) }
        </div>
    )
}
