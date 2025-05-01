import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";

export default function EventPage({ attractions }) {

    const { slug } = useParams();
    const [artists, setArtists] = useState([]);

    const attraction = attractions.find(attraction =>
        attraction.name.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (!attraction) {
        return <p>Ingen festival funnet...</p>;
    }

    useEffect(() => {
        const getArtists = async () => {
            if (!attraction) return;

            const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";
            const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&attractionId=${attraction.id}`;

            //Chat gpt, samma metod som i app.jsx
            try {
                const response = await fetch(url);
                const data = await response.json();

                const event = data._embedded?.events?.[0];
                const artistList = event?._embedded?.attractions || [];
                setArtists(artistList);
             }   catch (error) {
                console.error("Skjedde noe feil ved fetch av artister", error);
            }
        };

        getArtists();
    }, [attraction]);

    return (
        <>
            <h2>{attraction.name}</h2>

            {artists.length > 0 && (
                <section>
                    <h2>Artister:</h2>
                    <ul>
                        {artists.map((artist) => (
                            <li key={artist.id}>
                                <ArtistCard artist={artist} />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}