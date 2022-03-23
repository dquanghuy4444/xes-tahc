import React , {useState} from "react"

import Input from "./Input"

const Content = ({ mess = [], id }) => {

    const [messengers , setMessengers] = useState(mess)

    return (
        <div className="h-full flex flex-col">
            <div className="overflow-auto content-chat px-4">
                <p>huy</p>
            </div>

            <Input id={ id } />
        </div>
    )
}

export default Content
