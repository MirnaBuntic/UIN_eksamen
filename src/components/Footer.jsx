import React from "react";
import "../styles/footer.scss"

//Lager en footer med en klikkbar link til ticketmaster APO docs som åpner
//i ett nytt vindu når man klikker på den.
export default function Footer () {
    return (
        <footer aria-label="Footer med ticketmaster API attributt">
            <p>Alt av eventer, attraksjoner og spillesteder er tilgjengeliggjort og levert av {" "}
                <a 
                href= "https://developer.ticketmaster.com/"
                target="_blank"
                >Ticketmaster Discovery API</a></p>
        </footer>
    );
}