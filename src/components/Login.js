import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"
function Login() {
    let navigate = useNavigate();
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")


    function handlesubmit(event) {
        console.log("handle submit ran")
        event.preventDefault();
        let x = event.target.email.value;
        let y = event.target.password.value
        setEmail(x)
        setPassword(y)
    }
    async function loginUserApi() {
        let payload = { "email": email, "password": password }
        console.log("the payload is")
        console.log(payload)
        let apiData = await fetch("http://127.0.0.1:5004/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(payload),
        });
        let responseData = await apiData.json()
        if (responseData.success == true)
        {
            localStorage.setItem("authToken", responseData.token)
            navigate("/homepage")
            console.log("Modifying localstorage")
        }
    }
    useEffect(() => {
        loginUserApi()
    })

    return (

        <div className="loginFormContainer">
            <div className="loginForm">
                <form onSubmit={handlesubmit}>
                    <label htmlFor="email">Email:</label><br />
                    <input type="text" id="email" name="email"></input><br />
                    <label htmlFor="password">Password:</label><br />
                    <input type="text" id="password" name="password"></input><br />
                    <button id="login" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;