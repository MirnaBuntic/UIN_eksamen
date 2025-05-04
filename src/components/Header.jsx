import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/header.scss"

export default function Header(){
    return (
        <header className="header">
            {/* Logo - link til forside*/}
            <Link to="/" id="logo">BilettLyst</Link>

            <Nav />
        </header>
    );
}