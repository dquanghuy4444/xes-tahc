import React, { Suspense } from "react"

import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import Layout from "layout"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

const routes = [
    {
        path      : "/",
        hasLayout : true,
        element   : React.lazy(() => import("./pages/Dashboard"))
    },
    {
        path      : "/room/:id",
        hasLayout : true,
        element   : React.lazy(() => import("./pages/ChatRoom"))
    },
    {
        path      : "/login",
        hasLayout : false,
        element   : React.lazy(() => import("./pages/Login"))
    },
    {
        path      : "*",
        hasLayout : false,
        element   : React.lazy(() => import("./pages/NotFound"))
    }
]

const App = () => {
    const createRoute = ({ element, children, hasLayout, ...route }) => {
        const Component = element

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
                <Suspense
                    fallback={ (
                        <Backdrop
                            open={ true }
                            sx={ { color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 } }
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                      ) }
                >
                    <Routes>{ routes.map(createRoute) }</Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
