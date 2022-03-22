import { toast } from "react-toastify"

export const showNotification = (type, content, op) => {
    const tempOp = {
        position        : "top-right",
        autoClose       : 5000,
        hideProgressBar : false,
        closeOnClick    : true,
        pauseOnHover    : true,
        draggable       : true,
        ...op
    }
    if (type){
        toast[type](content, tempOp)
    } else {
        toast(content, tempOp)
    }
}
