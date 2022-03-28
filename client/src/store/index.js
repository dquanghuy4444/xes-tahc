import create from "zustand"
import { combine } from "zustand/middleware"

const initialState = {
    socket               : null,
    myInfor              : null,
    chatRoomInfor        : null,
    messengers           : [],
    chatRoomDescriptions : []
}

const mutations = (set, get) => {
    return {
        setSocket: (newSocket) =>
            set((state) => ({
                ...state,
                socket: newSocket
            })),
        setMyInfor: (newInfo) =>
            set((state) => ({
                ...state,
                myInfor: newInfo
            })),
        setChatRoomInfor: (newInfo) => {
            if (!newInfo){
                set((state) => ({
                    ...state,
                    chatRoomInfor: null
                }))

                return
            }
            set((state) => ({
                ...state,
                chatRoomInfor: {
                    ...state.chatRoomInfor,
                    ...newInfo
                }
            }))
        },
        setMessengers: (newMess) =>
            set((state) => ({
                ...state,
                messengers: newMess.length === 0 ? [] : [...state.messengers, ...newMess]
            })),
        setNewMessengers: (newMess) =>
            set((state) => ({
                ...state,
                messengers: newMess
            })),
        setChatRoomDescriptions: (newDesc) =>
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
                    chatRoomDescriptions: [...newDesc, ...state.chatRoomDescriptions]
                }
            })
    }
}

export const useStore = create(combine(initialState, mutations))
