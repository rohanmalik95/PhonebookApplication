import React, { useEffect, useState } from "react";
import "./design.css"

function MainPage() {
    return (
    <>
        <div className="header">
            <h4 id="headername">My Phone Book</h4>
            <div className="addnew" >
                <p>+</p>
            </div>
        </div>
        <div className="addcontact" >
            <form id="addform">
                <label htmlFor="emailadd">Name:</label><br />
                <input id="nameadd" type="text" name="name" /><br />
                <label htmlFor="emailadd">Email:</label><br />
                <input id="emailadd" type="text" name="email" /><br />
                <label htmlFor="phoneadd">Phone Number:</label><br />
                <input id="phoneadd" type="text" name="phone" /><br />
                <label htmlFor="companyadd">Company:</label><br />
                <input id="companyadd" type="text" name="company" /><br />
                <button id="formaddbutton" type="submit" >Add</button>
                <button id="formcancelbutton" type="close" >Cancel</button>
            </form>
        </div>
    </>
    )
}

export default MainPage;
