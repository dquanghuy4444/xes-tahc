import { useEffect , useState } from "react"

import { fetchData } from "helper"

const useFetchDataNoSave = (path, cb, deps = []) => {
    const [isLoading , setIsLoading] = useState(false)

    useEffect(() => {
        const getDataFromServer = async() => {
            setIsLoading(true)

            const res = await fetchData(path)
            cb(res)

            setIsLoading(false)
        }

        getDataFromServer()
    }, deps)

    return [isLoading]
}

export default useFetchDataNoSave
