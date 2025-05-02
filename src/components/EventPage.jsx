import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";

export default function EventPage({ attractions }) {

    const { slug } = useParams();
    const [festivalPasses, setFestivalPasses] = useState([]);
    const [artists, setArtists] = useState([]);

    const attraction = attractions.find(attraction =>
        attraction.name.toLowerCase().replace(/\s+/g, '-') === slug
    );


    useEffect(() => {
        const getFestivalData = async () => {
            if (!attraction) return;

            const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";
            const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&attractionId=${attraction.id}`;

            //Chat gpt, samma metod som i app.jsx
            try {
                const response = await fetch(url);
                const data = await response.json();

                const events = data._embedded?.events || [];

                const passes = events.map(event => ({
                    id:event.id,
                    name: event.name,
                    image: event.images?.[0]?.url,
                    date: event.dates?.start?.localDate,
                    venue: event._embedded?.venues?.[0]?.name,
                }));
                setFestivalPasses(passes);

                const artistList = events[0]?._embedded?.attractions || [];
                setArtists(artistList);


             }   catch (error) {
                console.error("Skjedde noe feil ved fetch av artister", error);
            }
        };

        getFestivalData();
    }, [attraction]);

    if (!attraction) {
        return <p>Ingen festival funnet...</p>;
    }

    return (
        <>
            <h2>{attraction.name}</h2>

            <h3>Sjanger:</h3>

            <h3>Følg oss på sosiale medier:</h3>

            {festivalPasses.length > 0 && (
                <section>
                    <h2>Festivalpass:</h2>
                    <ul>
                        {festivalPasses.map(pass => (
                            <li key={pass.id}>
                                {pass.image && <img src={pass.image} alt={pass.name} />}
                                <h>{pass.name}</h>
                                <p>{pass.venue}</p>
                                <p>{pass.date}</p>
                                <p>Kjøp</p>
                                <p>Legg til i ønskeliste</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

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