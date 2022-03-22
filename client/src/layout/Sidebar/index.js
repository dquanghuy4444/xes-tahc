import React, { useState } from "react"

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import FormControl from "@mui/material/FormControl"
import InputAdornment from "@mui/material/InputAdornment"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"

import ChatRoomcard from "./ChatRoomCard"

const Sidebar = () => {
    const [search, setSearch] = useState("")

    return (
        <section className="min-w-[360px] h-full border-border border-r-2 flex flex-col">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold	text-lg	">Messengers (69)</p>

                    <Avatar sx={ { bgcolor: blue[50], cursor: "pointer" , width: 36 , height: 36  } } onClick={ null }>
                        <AddIcon sx={ { fontSize: 20 , color: "black"} } />
                    </Avatar>
                </div>

                <FormControl fullWidth sx={ { mt: 2 } }>
                    <InputLabel htmlFor="outlined-adornment-amount">Search</InputLabel>

                    <OutlinedInput
                        id="outlined-adornment-amount"
                        label="Amount"
                        startAdornment={ (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                          ) }
                        value={ search }
                        onChange={ (e) => setSearch(e.target.value) }
                    />
                </FormControl>
            </div>

            <div className="overflow-auto pl-4 pr-2 pb-2">
                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />

                <ChatRoomcard />
            </div>
        </section>
    )
}

export default Sidebar
