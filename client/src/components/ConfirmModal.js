import * as React from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export default function ConfirmModal({ open, close, title , content , handle }){
    const handleConfirm = async() => {
        await handle()
        close()
    }

    return (
        <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            open={ open }
            onClose={ close }
        >
            <DialogTitle id="alert-dialog-title">{ title }</DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    { content }
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={ close }>Thoát</Button>

                <Button onClick={ handleConfirm }>Đồng ý</Button>
            </DialogActions>
        </Dialog>
    )
}
