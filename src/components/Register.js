import React, { useEffect } from "react";
import { useState } from "react";

function Register() {
    let [username,setUsername]= useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    function handlesubmit(e)
    {
        let x = e.target.username.value
        let y = e.target.email.value
        let z = e.target.password.value
        setUsername(x)
        setEmail(y)
        setPassword(z)
        registerUserApi(x,y,z)

    }


    async function registerUserApi(a,b,c)
    {
        let payload = {
            "username":a,
            "email":b,
            "password":c
        }
        let apiData = await fetch("http://127.0.0.1:5004/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(payload),
        });
        let responseJson = await apiData.json()
    }
    useEffect(()=>
    {
        console.log("Running use Effect block!")
    })
    return (

        <div className="loginFormContainer">
            <div className="loginForm">
                <form onSubmit={handlesubmit}>
                    <label htmlFor="username">Username:</label><br />
                    <input type="text" id="username" name="username"></input><br />
                    <label htmlFor="email">Email:</label><br />
                    <input type="text" id="email" name="email"></input><br />
                    <label htmlFor="password">Password:</label><br />
                    <input type="text" id="password" name="password"></input><br />
                    <button id="addcontact" type="submit">Register User</button>
                </form>
            </div>
        </div>
    );
}

export default Register;