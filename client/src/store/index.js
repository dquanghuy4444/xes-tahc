import create from "zustand"

export const useStore = create((set) => ({
    myInfor    : null,
    setMyInfor : (newInfo) =>
        set((state) => ({
            ...state,
            myInfor: newInfo
        }))
}))
