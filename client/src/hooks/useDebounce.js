import { useEffect, useCallback } from "react"

import { debounce } from "lodash"

const useDebounce = (cb, deps, delay = 360) => {
    const delayedQuery = useCallback(debounce(cb, delay), deps)

    useEffect(() => {
        delayedQuery()

        return delayedQuery.cancel
    }, [...deps, delayedQuery])
}

export default useDebounce
