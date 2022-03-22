import React from "react"

import Content from "./Content"
import Header from "./Header"
import Sidebar from "./Sidebar"

import "./index.css"

const Index = ({ children }) => {
    return (
        <div className="h-screen flex flex-col bg-white">
            <Header />

            <main className="flex main-layout">
                <Sidebar />

                <Content>{ children }</Content>
            </main>
        </div>
    )
}

export default Index
