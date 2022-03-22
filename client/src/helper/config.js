import axios from "axios"
import { API_URL } from "configs/env"

axios.defaults.headers = {
    "Content-Type": "application/json"
}

axios.defaults.baseURL = `${API_URL}/v1`

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token){
            config.headers["x-auth-token"] = token
        }

        return config
    },
    (error) => Promise.reject(error)
)

axios.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return {
            error
        }
    }
)

export { axios }
