const SOCKET_EVENT_NAMES = {
    CLIENT: {
        JOIN_ROOM      : "CLIENT:JOIN_ROOM",
        SEND_USERID    : "CLIENT:SEND_USERID",
        SEND_MESSENGER : "CLIENT:SEND_MESSENGER",
        CREATE_ROOM    : "CLIENT:CREATE_ROOM"
    },
    SERVER_SOCKET: {
        SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION : "SERVER_SOCKET:SEND_DATA_FOR_CHAT_ROOM_DESCRIPTION",
        SEND_DATA_FOR_CHAT_ROOM_MESSENGERS  : "SERVER_SOCKET:SEND_DATA_FOR_CHAT_ROOM_MESSENGERS"
    }
}


export { SOCKET_EVENT_NAMES }