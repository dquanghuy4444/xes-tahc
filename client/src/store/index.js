import create from "zustand"

export const useStore = create((set) => ({
    myInfor    : null,
    setMyInfor : (newInfo) =>
        set((state) => ({
            ...state,
            myInfor: newInfo
        })),
    chatRoomInfor    : null,
    setChatRoomInfor : (newInfo) =>
        set((state) => ({
            ...state,
            chatRoomInfor: {
                ...state.chatRoomInfor,
                ...newInfo
            }
        })),
    messengers    : [],
    setMessengers : (newMess) =>
        set((state) => ({
            ...state,
            messengers: newMess.length === 0 ? [] : [...state.messengers , ...newMess]
        })),
    chatRoomDescriptions    : [],
    setChatRoomDescriptions : (newDesc) =>
        set((state) => {
            if (newDesc.length === 1){
                if (state.chatRoomDescriptions.some((desc) => desc.id === newDesc[0].id)){
                    return {
                        ...state,
                        chatRoomDescriptions: state.chatRoomDescriptions.map((desc) => {
                            if (desc.id === newDesc[0].id){
                                return {
                                    ...desc,
                                    ...newDesc[0]
                                }
                            }

                            return desc
                        })
                    }
                }
            }

            return {
                ...state,
                chatRoomDescriptions: [...state.chatRoomDescriptions, ...newDesc]
            }
        })
}))
