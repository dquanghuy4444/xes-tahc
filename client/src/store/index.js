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
            chatRoomInfor: newInfo
        })),
    messengers    : [],
    setMessengers : (newMess) => set((state) => ({
        ...state,
        messengers: [...newMess, ...state.messengers]
    }))
}))
