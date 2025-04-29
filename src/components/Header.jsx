import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";

export default function Header(){
    return (
        <header>
            {/* Logo - link til forside*/}
            <Link to="/" id="logo">
            <img src="" alt="logo"></img>
            </Link>

            <Nav />
        </header>
    );
}