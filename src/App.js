import logo from './logo.svg';
import './App.css';
import Mainpage from "./components/Mainpage.js"
import Contact from "./components/Contact.js"
import { useState } from 'react';
import { useRef } from 'react';
import "./components/design.css"
import Login from "./components/Login.js"
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Register from "./components/Register.js"
import Homepage from "./components/Homepage.js"
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login></Login>}/>
      <Route path="/register" element = {<Register></Register>} />
      <Route path="/homepage" element={<Homepage></Homepage>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App; 
