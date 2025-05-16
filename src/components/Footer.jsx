import React from "react";
import "../styles/footer.scss"


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