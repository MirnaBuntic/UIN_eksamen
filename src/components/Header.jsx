import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/header.scss"


export default function Header(){
    return (
        <header className="header" aria-label="Toppnavigasjon">
            {/* Logo - link til forside*/}
            <Link to="/" id="logo" aria-label="Gå til startsiden">BillettLyst</Link>

            <Nav />
        </header>
    );
}