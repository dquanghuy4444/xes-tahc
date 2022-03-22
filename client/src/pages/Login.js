import React, { useState } from "react"

import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { postData } from "helper"
import { useNavigate } from "react-router-dom"
import { showNotification } from "utils"

export default function Login(){
    const [isSignInPage, setIsSignInPage] = useState(true)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("Huy Quang")
    const [phoneNumber, setPhoneNumber] = useState("0963181679")
    const [email, setEmail] = useState("huydq@gmail.com")

    const navigate = useNavigate()

    const handleSignUp = async() => {
        if (password !== confirmPassword){
            showNotification("error", "Mật khẩu xác nhận không giống với mật khẩu tài khoản")

            return
        }
        const res = await postData("auth/register", {
            username: userName,
            password,
            phoneNumber,
            email,
            fullName
        })

        if (res){
            localStorage.setItem("token", res)
            navigate("/", { replace: true })
            showNotification("info", "Chào mừng bạn đến với xes-tahc")
        } else {
            showNotification("error", "Đăng kí thất bại")
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
                navigate("/", { replace: true })
                showNotification("info", "Chào mừng bạn đến với xes-tahc")
            } else {
                showNotification("error", "Đăng nhập thất bại")
            }

            return
        }

        await handleSignUp()
    }

    return (
        <div className="bg-[#1e88e5] w-screen h-screen">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit">
                <Card sx={ { maxWidth: 400, padding: 2 } }>
                    <Typography component="h6" sx={ { textAlign: "center" } } variant="h6">
                        Chào mừng đến với xes-tahc
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
                            <>
                                <TextField
                                    fullWidth
                                    label="Nhập lại Mật khẩu"
                                    sx={ { mt: 2 } }
                                    type="password"
                                    value={ confirmPassword }
                                    variant="outlined"
                                    onChange={ (e) => setConfirmPassword(e.target.value) }
                                />

                                <TextField
                                    fullWidth
                                    label="Họ tên"
                                    sx={ { mt: 2 } }
                                    value={ fullName }
                                    variant="outlined"
                                    onChange={ (e) => setFullName(e.target.value) }
                                />

                                <TextField
                                    fullWidth
                                    label="SĐT"
                                    sx={ { mt: 2 } }
                                    value={ phoneNumber }
                                    variant="outlined"
                                    onChange={ (e) => setPhoneNumber(e.target.value) }
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    sx={ { mt: 2 } }
                                    value={ email }
                                    variant="outlined"
                                    onChange={ (e) => setEmail(e.target.value) }
                                />
                            </>
                        ) }
                    </CardContent>

                    <CardActions sx={ { mt: 2 } }>
                        <Button fullWidth variant="contained" onClick={ handleSignIn }>
                            { isSignInPage ? "Đăng nhập" : "Đăng kí" }
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={ () => setIsSignInPage((prev) => !prev) }
                        >
                            { isSignInPage ? "Đăng kí" : "Trở về" }
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    )
}
