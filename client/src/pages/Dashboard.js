import React, { useState } from "react"

import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { postData } from "helper"

export default function Login(){
    const [isSignInPage, setIsSignInPage] = useState(true)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSignUp = async() => {
        if (password !== confirmPassword){
            return
        }
        const res = await postData("auth/register", {
            username    : userName,
            password,
            phoneNumber : "09876876876",
            email       : "huydq@dzt.com"
        })

        if (res){
            localStorage.setItem("token", res)
        }
    }

    const handleSignIn = async() => {
        if (isSignInPage){
            const res = await postData("auth/login", {
                username: userName,
                password
            })

            if (res){
                localStorage.setItem("token", res)
            }

            return
        }

        await handleSignUp()
    }

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Card sx={ { maxWidth: 1200, padding: 2 } }>
                <Typography component="h6" variant="h6">
                    Chào Huydq
                </Typography>

                <CardContent>
                    <TextField
                        fullWidth
                        label="Tên đăng nhập"
                        value={ userName }
                        variant="outlined"
                        onChange={ (e) => setUserName(e.target.value) }
                    />

                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        sx={ { mt: 2 } }
                        type="password"
                        value={ password }
                        variant="outlined"
                        onChange={ (e) => setPassword(e.target.value) }
                    />

                    { !isSignInPage && (
                        <TextField
                            fullWidth
                            label="Nhập lại Mật khẩu"
                            sx={ { mt: 2 } }
                            type="password"
                            value={ confirmPassword }
                            variant="outlined"
                            onChange={ (e) => setConfirmPassword(e.target.value) }
                        />
                    ) }
                </CardContent>
            </Card>
        </div>
    )
}
