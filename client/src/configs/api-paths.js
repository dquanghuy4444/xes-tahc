export const ChatRoomApiPath = new (function(){
    (this.index = "chat-rooms"),
        (this.myChatRoom = `${this.index}/me`),
        (this.myChatRoomBySearch = (search) => `${this.myChatRoom}/${search}`),
        (this.ourChatRoom = (id) => `${this.myChatRoom}/user/${id}`),
        (this.chatRoomDetail = (id) => `${this.index}/${id}`),
        (this.member = (id) => `${this.index}/${id}/member`)
})()

export const MessengerApiPath = new (function(){
    (this.index = "messengers"),
    (this.messengersInRoom = (id) => `${this.index}/${id}`),
    (this.sendFiles = `${this.index}/files`)
})()

export const AuthApiPath = new (function(){
    (this.index = "auth"),
        (this.login = `${this.index}/login`),
        (this.register = `${this.index}/register`)
})()

export const UserApiPath = new (function(){
    (this.index = "users"),
        (this.myDetail = `${this.index}/me`),
        (this.suggestUsers = (removeUsers = [], search = "") => {
            const arrStr = []
            if (removeUsers.length > 0){
                arrStr.push(`remove_users=${removeUsers.join(",")}`)
            }
            if (search){
                arrStr.push(`search=${search}`)
            }

            const paramsStr = arrStr.join("&")

            return `${this.index}${paramsStr ? `?${paramsStr}` : ""}`
        })
})()
