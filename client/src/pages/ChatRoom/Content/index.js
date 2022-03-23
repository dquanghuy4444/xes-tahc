import React from "react"

import Input from "./Input"

const Content = ({ messengers, id , userInfors }) => {
    console.log(messengers)
    console.log(userInfors)

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
