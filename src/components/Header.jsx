import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/header.scss"



//I headeren som er laget under består av en link med navnet på siden som en "logo" samt nav som er importert og lagt inn i header.
//Is logged in blir lagt til som en prop for å formidle om man er logget inn eller ikke.
export default function Header({ isLoggedIn }) {
    return (
        <header className="header" aria-label="Toppnavigasjon">

            <Link to="/" id="logo" aria-label="Gå til startsiden">BillettLyst</Link>

    
            <Nav isLoggedIn={isLoggedIn}/>
        </header>
    );
}