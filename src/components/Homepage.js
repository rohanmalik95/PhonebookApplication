import React, { useEffect } from "react";
import { useState } from "react";
import { json } from "react-router-dom";
import "./Homepage.css"
import "./design.css"
import deleteimage from "./deleteimage.png"
import editimage from "./editimage.png"
import emailimage from "./emailimage.png"
import contactimage from "./contactimage.png"
import workplaceimage from "./workplaceimage.png"
import phoneimage from "./phoneimage.png"
import { useNavigate } from "react-router-dom";

function Homepage() {
    let [data, setData] = useState([])
    let navigate = useNavigate();
    let [addtoggle, setAddtoggle] = useState(false)
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [organization, setOrganization] = useState("")
    let [edittoggle, setEdittoggle] = useState(false)
    let [editnoteid,setEditnoteid]=useState({})




    //Calling the getall api to get all the contacts of the user from the
    //database and then display it on the screen
    async function getNotes() {
        let payload = localStorage.getItem("authToken")
        if (payload == null) {
            navigate("/login")
        }
        else {

            console.log("loggin in using the authToken")
            console.log(payload)

            let apiData = await fetch("http://127.0.0.1:5002/getall", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": payload
                }
            }
            );
            let jsonData = await apiData.json()
            let jsonMessage = jsonData.message;
            setData(jsonMessage)
            console.log("type of data is:")
            console.log(typeof data)
        }
    }


    //Handling the logout button click by the user
    function logoutfunction(e) {
        localStorage.clear();
        window.location.reload();
    }


    //function to handle add click by the user and a function to call the 
    //add contact api to add the details entered by the user in the form
    async function handleaddclick(e) 
    {
        e.preventDefault();
        let x = e.target.name.value
        let y = e.target.email.value
        let z = e.target.phone.value
        let m = e.target.organization.value
        setName(x)
        setEmail(y)
        setPhone(z)
        setOrganization(m)
        await calladdAPI(x, y, z, m)
        setAddtoggle(!addtoggle)
        window.location.reload();
    }

    async function calladdAPI(a, b, c, d) 
    {
        let payload = {
            "name": a,
            "email": b,
            "phone": c,
            "organization": d
        }
        console.log("Adding the contact:")
        console.log(payload)
        console.log("add api called")
        let apiData = await fetch("http://127.0.0.1:5002/addcontact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("authToken")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(payload),
        });
        console.log("api calll complete")
        let response = await apiData.json()
        console.log(response)
    }

    //function to toggele view of the addcontact form
    function toggleaddcontact() {
        setAddtoggle(!addtoggle)
    }


    //handling the delete request made by the user
    function handledelete(id) {
        console.log("handling delete click!")
        console.log(id)
        console.log("initializing delete api")
        deleteApi(id)
    }

    async function deleteApi(x) {
        let apiData = await fetch("http://127.0.0.1:5002/deletecontact", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("authToken"),
                "contact-id": x
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });
        let jsonData = apiData.json()
        console.log("delete api response!")
        console.log(jsonData)
        window.location.reload()
    }


    //Handling the edit contact request sent by the user
    function editclick(note){
        setEdittoggle(!edittoggle)
        setEditnoteid(note)
    }
    async function handleeditclick(e) {
        e.preventDefault()
        console.log("Clicked handle edit!")
        let x1 = e.target.updatedname.value
        let y1 = e.target.updatedemail.value
        let z1 = e.target.updatedphone.value
        let m1 = e.target.updatedorganization.value
        console.log(x1,y1,z1,m1)
        await calleditApi(x1, y1, z1, m1)
        setEdittoggle(!edittoggle)
        window.location.reload();
    }

    async function calleditApi(x1,y1,z1,m1) {
        let payload ={
            "name":x1,
            "email":y1,
            "phone":z1,
            "organization":m1,
        }
        console.log(payload)
        let apiData = await fetch("http://127.0.0.1:5002/updatecontact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("authToken"),
                "contact-id": editnoteid.id
            },
            body: JSON.stringify(payload)
        });
        let jsonData= await apiData.json()
        console.log("edit api response received!")
        console.log(jsonData)
    }
    useEffect(() => {
        getNotes()
    }, [])

    return (
        <>
            <div className="navigationBar">
                <div className="navbarcontents">
                    <h2> Phonebook Application</h2>
                    <button id="logout" onClick={logoutfunction}>Logout</button>
                    <p onClick={toggleaddcontact}>+</p>
                </div>
            </div>


            {
                data.map((e, i) => {
                    return (
                        <div key={i} className="contactdetails">
                            <div className="detailcontainer">
                                <div className="detailspart1">
                                    < img src={contactimage} id="contactimgage" alt="contactimage" ></img>
                                    <h3 id="contactname">{e.name}</h3>


                                    < img src={phoneimage} id="phoneimage" alt="phoneimage" ></img>
                                    <h3 id="phonenumber">{e.phone}</h3>

                                    < img src={workplaceimage} id="workplaceimgage" alt="worktimage" ></img>
                                    <h3 id="workplacename">{e.organization} </h3>

                                    < img src={emailimage} id="emailimgage" alt="contactimage" ></img>
                                    <h3 id="contactemail">{e.email}</h3>
                                </div>

                                <div className="detailspart2">
                                    <div className="editcontact">
                                        < img src={editimage} id="editcontactimage" onClick={() => { editclick(e) }}></img>
                                    </div>
                                    <div className="deletecontact" onClick={(event) => { handledelete(e.id) }}>
                                        < img src={deleteimage} id="deletecontactimage" alt="contactimage" ></img>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                }
                )}
            <div className="addContact" style={{ display: addtoggle ? "inline" : "none" }}>
                <div className="loginFormContainer">
                    <div className="loginForm" >
                        <form onSubmit={handleaddclick} >
                            <label htmlFor="name">Name:</label><br />
                            <input type="text" id="name" name="name"></input><br />
                            <label htmlFor="email">Email:</label><br />
                            <input type="text" id="email" name="email"></input><br />
                            <label htmlFor="phone">Phone:</label><br />
                            <input type="text" id="phone" name="phone"></input><br />
                            <label htmlFor="organization">Organization:</label><br />
                            <input type="text" id="organization" name="organization"></input><br />
                            <button id="addcontact" type="submit" >Add Contact</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="addContact" style={{ display: edittoggle ? "inline" : "none" }}>
                <div className="loginFormContainer">
                    <div className="loginForm" >
                        <form onSubmit={handleeditclick} >
                            <label htmlFor="name">Name:</label><br />
                            <input type="text" id="updatedname" name="updatedname" ></input><br />
                            <label htmlFor="email">Email:</label><br />
                            <input type="text" id="updatedemail" name="updatedemail"></input><br />
                            <label htmlFor="phone">Phone:</label><br />
                            <input type="text" id="updatedphone" name="updatedphone"></input><br />
                            <label htmlFor="organization">Organization:</label><br />
                            <input type="text" id="updatedorganization" name="updatedorganization"></input><br />
                            <button id="addcontact" type="submit" >Update Contact</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Homepage;   