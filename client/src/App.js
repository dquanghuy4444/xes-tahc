import React, { useEffect, useState, Suspense } from "react"

import { fetchData } from "helper"
import Layout from "layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

const routes = [
    {
        path      : "/",
        hasAuth   : true,
        hasLayout : true,
        element   : React.lazy(() => import("./pages/Dashboard"))
    },
    {
        path      : "/room/:id",
        hasAuth   : true,
        hasLayout : true,
        element   : React.lazy(() => import("./pages/ChatRoom"))
    },
    {
        path      : "/login",
        hasAuth   : false,
        hasLayout : false,
        element   : React.lazy(() => import("./pages/Login"))
    },
    {
        path      : "*",
        hasAuth   : false,
        hasLayout : false,
        element   : React.lazy(() => import("./pages/NotFound"))
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

            if (!res){
                setIsAuthenticated(false)
            }
        }

        getAuthen()
    }, [])

    const createRoute = ({ element, children, hasAuth, hasLayout, ...route }) => {
        const Component = element
        // const Component = hasAuth > 0 ? withAuthor(element, isAuthenticated) : element

        return (
            <Route
                key={ route.path }
                { ...route }
                element={
                    hasLayout ? (
                        <Layout>
                            <Component />
                        </Layout>
                    ) : (
                        <Component />
                    )
                }
            >
                { children && children.map(createRoute) }
            </Route>
        )
    }

    return (
        <>
            <ToastContainer />

            <BrowserRouter>
                <Suspense fallback={ <div>Loading...</div> }>
                    <Routes>{ routes.map(createRoute) }</Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
