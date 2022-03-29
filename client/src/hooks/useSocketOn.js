import { useEffect, useState } from "react"

import { useStore } from "store"

const useSocketOn = (eventName, cb) => {
    const socket = useStore((state) => state.socket)

    const [data, setData] = useState(null)

    useEffect(() => {
        if(!data){
            return
        }
        cb(data)
    }, [data])

    useEffect(() => {
        if (!socket){
            return
        }

        socket.on(eventName, (d) => setData(d))

        return () => {
            socket.off(eventName, cb)
        }
    }, [socket])
}

export default useSocketOn
