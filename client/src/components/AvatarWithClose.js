import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Avatar from "@mui/material/Avatar"

const AvatarWithClose = ({close , ...props}) => {
    return (
        <div className="relative w-fit">

            <Avatar { ...props } />

            <div className="absolute -right-1 -top-1 rounded-full	bg-white shadow-secondary w-5 h-5 flex-center cursor-pointer" onClick={ close }>
                <CloseIcon sx={ { fontSize: 16 } } />
            </div>
        </div>
    );
}

export default AvatarWithClose;
