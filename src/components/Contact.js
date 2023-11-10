import React, { useEffect, useRef, useState } from "react";


function ContactItem(props) {

    return (
        <>
            <div className="header">
                <h4 id="headername">My Phone Book</h4>
                <div className="addnew" >
                    <p>+</p>
                </div>
            </div>
            <div className="contactdetails">
                <div className="detailcontainer">
                    <div className="detailspart1">
                        < img id="contactimgage" alt="contactimage" ></img>
                        <h3 id="contactname">Name</h3>

                      
                        < img id="phoneimage" alt="phoneimage" ></img>
                        <h3 id="phonenumber">Phone</h3>

                        < img id="workplaceimgage" alt="worktimage" ></img>
                        <h3 id="workplacename">Company </h3>

                        < img id="emailimgage" alt="contactimage" ></img>
                        <h3 id="contactemail">Email</h3>
                    </div>

                    <div className="detailspart2">
                        <div className="editcontact">
                            < img id="editcontactimage" ></img>
                        </div>
                        <div className="deletecontact">
                            < img id="deletecontactimage" alt="contactimage" ></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactItem;