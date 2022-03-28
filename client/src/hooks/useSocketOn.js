import { useEffect } from "react"

import { useStore } from "store"

const useSocketOn = (eventName, cb) => {
    const socket = useStore((state) => state.socket)

    useEffect(() => {
        if (!socket){
            return
        }

        socket.on(eventName, cb)

        return () => {
            socket.off(eventName, cb);
        }
    }, [socket])
}

export default useSocketOn
