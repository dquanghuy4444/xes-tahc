export const ChatRoomApiPath = new (function(){
    (this.index = "chat-rooms"),
        (this.myChatRoom = `${this.index}/me`),
        (this.chatRoomDetail = (id) => `${this.index}/${id}`),
        (this.member = (id) => `${this.index}/${id}/member`)
})()

export const MessengerApiPath = new (function(){
    this.index = "messengers",
    this.messengersInRoom = (id) => `${this.index}/${id}`
})()

export const AuthApiPath = new (function(){
    this.index = "auth",
    this.login = `${this.index}/login`,
    this.register = `${this.index}/register`
})()

export const UserApiPath = new (function(){
    this.index = "users",
    this.myDetail = `${this.index}/me`,
    this.suggestUsers = (removeUsers = []) => `${this.index}${removeUsers.length === 0 ? "" : `?remove_users=${removeUsers.join(',')}`}`
})()
