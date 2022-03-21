import React, { useEffect,useState, Suspense } from "react"

import { fetchData } from "helper"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

const routes = [
    {
        path    : "/",
        hasAuth : true,
        element : React.lazy(() => import("./pages/Dashboard"))
    },
    {
        path    : "/login",
        hasAuth : false,
        element : React.lazy(() => import("./pages/Login"))
    },
    {
        path    : "*",
        hasAuth : false,
        element : React.lazy(() => import("./pages/NotFound"))
    }
]

const withAuthor = (Component, isAuthenticated) => {
    // eslint-disable-next-line react/display-name
    return () => {
        if (!isAuthenticated){
            return <Navigate to="/login" />
        }

        return <Component />
    }
}

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    useEffect(() => {
        const getAuthen = async() => {
            const res = await fetchData("users/me")

            if(!res){
                setIsAuthenticated(false)
            }
        }

        getAuthen()
    } , [])

    const createRoute = ({ element, children, hasAuth, ...route }) => {
        const Component = element
        // const Component = hasAuth > 0 ? withAuthor(element, isAuthenticated) : element

        return (
            <Route key={ route.path } { ...route } element={ <Component /> }>
                { children && children.map(createRoute) }
            </Route>
        )
    }

    return (
        <BrowserRouter>
            <Suspense fallback={ <div>Loading...</div> }>
                <Routes>{ routes.map(createRoute) }</Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
