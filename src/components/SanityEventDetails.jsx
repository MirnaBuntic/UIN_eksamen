import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Sanityevent.scss"
import { client } from "../Sanity/sanityClient";


export default function SanityEventDetails() {
    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7'; //Min apinyckel

    //const variabel för att hämta id från urlen sanity-event/:id så att man vet vilket event som ska visas på sidan
    const { id } = useParams();
    //state-variabel för eventdatan
    const [ticketData, setTicketData] = useState(null);
    //state-variabel för brukere som har eventet i önskeliste eller tidigere kjöp
    const [relUsers, setRelUsers] = useState([]);

    //Asykron funktion för att använda await och hämta data från Ticketmaster sitt api
    const fetchTicketMaster = async () => {
        try {
            //Gör ett anrop till ticketmaster och skickar med event id:et som vi fick i url:en.
            const eventResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`);
            //Checkar om anropet fungerar
            if (eventResponse.ok) {
                //omvandlar svaret till json format så vi kan använda det i JS
                const eventData = await eventResponse.json();
                //Hämtar relevant info och sparar det i staten ticketData
                setTicketData({
                    id: eventData.id,
                    name: eventData.name,
                    image: eventData.images?.[0]?.url,
                    date: eventData.dates?.start?.localDate,
                    venue: eventData._embedded?.venues?.[0]?.name,
                    type: eventData.classifications?.[0]?.segment?.name,
                });
                return;
            }
        //En catch som fångar upp problem i apianropet och skriver ut detta i konsollen
        } catch (error) {
            console.error("Skjedde noe feil ved henting av eventinfo", error);
        }
    };

    //UseEffect som körs första komponenten renderas eller om id ändras.
    useEffect(() => {
        if (id) fetchTicketMaster();
    }, [id]);

    //Hämtar brukere från Sanity
    const fetchUsers = async () => {
        try {
            //Hämtar brukere och deras önskelista och tidigere kjöp
            const users = await client.fetch(`*[_type == "bruker"]{
                name,
                image { asset->{url} },
                wishList[]->{apiId},
                previousPurchases[]->{apiId}
            }`);

            //Filtrerar ur de brukere som har eventid i ösnkelista eller tidigere kjöp
            const match = users.filter(user => {
                const allEvents = [...(user.wishList || []), ...(user.previousPurchases || [])];
                return allEvents.some(event => event.apiId === id);
            });
            //Sparar brukene som matchar i relUsers staten
            setRelUsers(match);
        } catch (error) {
            console.error("Skjedde noe feil ved henting av brukere", error);
        }
    };

    useEffect(() => {
        //Körs om det finns giltigt id
        if (id) fetchUsers();
    }, [id]); // Körs om id ändras
    

    return (
        <>
            {/* Brödsmule stig så att brukeren vet på vilekn sida man befinner sig och kan gå tillbaka till den tidigare sidan*/}
            <nav aria-label="Brødsmulesti">
                <ul>
                    <li className="underline">
                        <Link to="/dashboard" aria-label="Gå til dashbord">Min side</Link>
                    </li>
                    <li aria-hidden="true">{">"}</li>
                    <li aria-current="page">{ticketData?.name}</li>
                </ul>
            </nav>

            {/*Om ticketData finns visa information om event */}
            {ticketData ? (
                <article className="eventdetailes" aria-label="Eventdetaljer" tabIndex="0">
                    <h1 tabIndex="0">{ticketData.name}</h1>
                    {/*Visa bild om den finns i ticketData*/}
                    {ticketData.image && <img src={ticketData.image} alt={`Bilde av ${ticketData.name}`} tabIndex="0" />}
                    <h3 tabIndex="0">Dato og sted</h3>
                    <p>Dato: {ticketData.date || "Ukjent dato"}</p>
                    <p>Sted: {ticketData.venue || "Ukjent sted"}</p>
                    <h3 tabIndex="0">Sjanger</h3>
                    <p>{ticketData.type || "Ingen sjanger oppgitt"}</p>
                </article>
            ) : (
                //Meddelande till brukeren om eventdatan tar tid att lasta in
                <p aria-live="polite">Laster info om eventet...</p>
            )}

            {/*Om det finns users i arrayen så visas info om dessa med namn och bild*/}
            {relUsers.length > 0 && (
                <article className="sanity-wishlist" aria-label="Brukere som har dette ønskelisten">
                    <h2 tabIndex="0">Hvem har dette i ønskeliste</h2>
                    <ul>
                        {relUsers.map((user) => (
                            <li key={user.name}>
                                {user.image?.asset?.url && (
                                    <img src={user.image.asset.url} alt={`Profilbilde av ${user.name}`}></img>
                                )}
                                <p>{user.name}</p>
                            </li>
                        ))}
                    </ul>
                </article>
            )}
        </>
    );
}