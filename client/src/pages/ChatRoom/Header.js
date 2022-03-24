import React from 'react';

import Avatar from "@mui/material/Avatar"
import { useStore } from "store"

const Header = () => {
    const roomInfor = useStore((state) => state.chatRoomInfor)

    return (
        <div className="border-border border-b-2 min-h-[64px] px-4 flex items-center">
            <Avatar alt="Remy Sharp" src={ roomInfor?.avatar || "" } sx={ { width: 48, height: 48 } } />

            <p className="ml-4 font-semibold text-[19px]">
                { roomInfor?.name }
            </p>
        </div>
    );
}

export default Header;
