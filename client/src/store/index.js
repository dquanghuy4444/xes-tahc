import { ENUM_STATUS_SET_STATE_ZUSTAND } from "constants"

import create from "zustand"
import { combine } from "zustand/middleware"

const initialState = {
    isInforBarDisplayed  : false,
    socket               : null,
    myInfor              : null,
    chatRoomInfor        : null,
    messengers           : [],
    chatRoomDescriptions : []
}

const mutations = (set, get) => {
    return {
        setIsInforBarDisplayed: (newState) =>
            set((state) => ({
                ...state,
                isInforBarDisplayed: newState
            })),
        setToggleInforBarDisplayed: () =>
            set((state) => ({
                ...state,
                isInforBarDisplayed: !state.isInforBarDisplayed
            })),
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
        setChatRoomInfor: (newInfo, status = ENUM_STATUS_SET_STATE_ZUSTAND.ADD) => {
            if (!newInfo){
                set((state) => ({
                    ...state,
                    chatRoomInfor: null
                }))

                return
            }
            if (status === ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW){
                set((state) => ({
                    ...state,
                    chatRoomInfor: newInfo
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
        setMessengers: (newMess, status = ENUM_STATUS_SET_STATE_ZUSTAND.ADD) => {
            if (status === ENUM_STATUS_SET_STATE_ZUSTAND.ADD){
                set((state) => ({
                    ...state,
                    messengers: [...state.messengers, ...newMess]
                }))
            } else if (status === ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW){
                set((state) => ({
                    ...state,
                    messengers: newMess
                }))
            }
        },
        setChatRoomDescriptions: (newDesc, status = ENUM_STATUS_SET_STATE_ZUSTAND.ADD) => {
            if (status === ENUM_STATUS_SET_STATE_ZUSTAND.ADD_NEW){
                set((state) => ({
                    ...state,
                    chatRoomDescriptions: newDesc
                }))

                return
            }
            if (status === ENUM_STATUS_SET_STATE_ZUSTAND.REMOVE){
                const temp = [...get().chatRoomDescriptions]
                temp.splice(
                    temp.findIndex((desc) => desc.id === newDesc[0].id),
                    1
                )
                set((state) => ({
                    ...state,
                    chatRoomDescriptions: temp
                }))

                return
            }
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
}

export const useStore = create(combine(initialState, mutations))
