import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Sanityevent.scss"
import { client } from "../Sanity/sanityClient";


export default function SanityEventDetails() {
    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';

    const { id } = useParams();
    const [ticketData, setTicketData] = useState(null);
    const [relUsers, setRelUsers] = useState([]);

    useEffect(() => {
        const fetchTicketMaster = async () => {
            try {
                const eventResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`);
                if (eventResponse.ok) {
                    const eventData = await eventResponse.json();
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
            } catch (error) {
                console.error("Skjedde noe feil ved henting av eventinfo", error);
            }
        };

        if (id) fetchTicketMaster();
    }, [id]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await client.fetch(`*[_type == "bruker"]{
                name,
                image { asset->{url} },
                wishList[]->{apiId},
                previousPurchases[]->{apiId}
            }`);

            const match = users.filter(user => {
                const allEvents = [...(user.wishList || []), ...(user.previousPurchases || [])];
                return allEvents.some(event => event.apiId === id);
            });

            setRelUsers(match);
        };

        if (id) fetchUsers();
    }, [id]);

    return (
        <>
            <nav aria-label="Brødsmulesti">
                <ul>
                    <li>
                        <Link to="/dashboard" aria-label="Gå til dashbord">Min side</Link>
                    </li>
                    <li aria-hidden="true">{">"}</li>
                    <li aria-current="page">{ticketData?.name}</li>
                </ul>
            </nav>

            {ticketData ? (
                <article className="eventdetailes" aria-label="Eventdetaljer" tabIndex="0">
                    <h1 tabIndex="0">{ticketData.name}</h1>
                    {ticketData.image && <img src={ticketData.image} alt={`Bilde av ${ticketData.name}`} tabIndex="0" />}
                    <h3 tabIndex="0">Dato og sted</h3>
                    <p>Dato: {ticketData.date} || "Ukjent dato"</p>
                    <p>Sted: {ticketData.venue || "Ukjent sted"}</p>
                    <h3 tabIndex="0">Sjanger</h3>
                    <p>{ticketData.type || "Ingen sjanger oppgitt"}</p>
                </article>
            ) : (
                <p aria-live="polite">Laster info om eventet...</p>
            )}

            {relUsers.length > 0 && (
                <article className="sanity-wishlist" aria-label="Brukere som har dette ønskelisten">
                    <h2 tabIndex="0">Hvem har dette i ønskeliste</h2>
                    <ul>
                        {relUsers.map((user) => (
                            <li>
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