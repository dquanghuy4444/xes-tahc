import React from "react"

import ChatIcon from "@mui/icons-material/Chat"

export default function Dashboard(){
    return (
        <div className="h-full">
            <div className="w-full h-full flex-center flex-col space-y-6">
                <ChatIcon sx={ { fontSize: 120 } } />

                <p className="text-xl font-semibold">
                    Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới
                </p>
            </div>
        </div>
    )
}
