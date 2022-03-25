import React from "react"

import Box from "@mui/material/Box"
import BasicModal from "@mui/material/Modal"

const style = {
    position     : "absolute",
    top          : "50%",
    left         : "50%",
    transform    : "translate(-50%, -50%)",
    minwidth     : 400,
    bgcolor      : "background.paper",
    outline      : "none",
    borderRadius : 1,
    boxShadow    : 24
}

export default function Modal({open , close , children}){

    return (
        <BasicModal
            aria-describedby="modal-modal-description"
            aria-labelledby="modal-modal-title"
            open={ open }
            onClose={ close }
        >
            <Box sx={ style }>
                { children }
            </Box>
        </BasicModal>
    )
}
