import { useState, useEffect } from "react"

import { fetchData } from "helper"

const useFetchData = (path, cb = null , deps = []) => {
    const [data, setData] = useState()

    useEffect(() => {
        const getDataFromServer = async() => {
            const res = await fetchData(path)

            setData(cb ? cb(res) : res)
        }

        getDataFromServer()
    }, deps)

    return data
}

export default useFetchData
