import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export default function SanityEventDetails() {
    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';

    const { id } = useParams();
    const [ticketData, setTicketData] = useState(null);

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

    return (
        <section>
            {ticketData ? (
                <article>
                    <h1>{ticketData.name}</h1>
                    {ticketData.image && <img src={ticketData.image} alt={ticketData.name} />}
                    <h3>Dato og sted</h3>
                    <p>Dato: {ticketData.date}</p>
                    <p>Sted: {ticketData.venue}</p>
                    <h3>Sjanger</h3>
                    <p>{ticketData.type}</p>
                </article>
            ) : (
                <p>Laster info om eventet...</p>
            )}
        </section>
    );
}