import { useEffect } from "react"

import { fetchData } from "helper"

const useFetchDataNoSave = (path, cb, deps = []) => {
    useEffect(() => {
        const getDataFromServer = async() => {
            const res = await fetchData(path)
            console.log(res)
            cb(res)
        }

        getDataFromServer()
    }, deps)
}

export default useFetchDataNoSave
