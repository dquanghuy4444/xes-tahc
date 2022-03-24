import React from "react"

import Box from "@mui/material/Box"
import { blue, teal } from "@mui/material/colors"
import Stack from "@mui/material/Stack"

export default function MessengerCard({ userInfor, content }){
    return (
        <Stack direction="row">
            <Box
                className={ `rounded-3xl py-2 px-4 w-fit max-w-[48%] text-overflow ${
                    userInfor?.isMe ? `ml-auto mr-0 text-white` : ""
                }` }
                sx={ { bgcolor: userInfor?.isMe ? blue["A400"] : teal[50] } }
            >
                <p className="text-[15px] text-overflow leading-5">
                    { content }
                </p>
            </Box>
        </Stack>
    )
}
