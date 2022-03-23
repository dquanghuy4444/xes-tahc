import React from "react"

import ReactDOM from "react-dom"

import App from "./App"

import "./styles/index.css"
import "./styles/variables.css"
import "react-toastify/dist/ReactToastify.css"

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)
