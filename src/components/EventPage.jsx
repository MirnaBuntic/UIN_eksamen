import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";
import EventCard from "./EventCard";

export default function EventPage({ attractions }) {

    const { slug } = useParams();
    const [genres, setGenres] = useState([]);
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

            //Chat gpt, samma metod som i app.jsx nr1
            try {
                const response = await fetch(url);
                const data = await response.json();

                const events = data._embedded?.events || [];

                const genres = events
                    .map(event => event.classifications?.[0]?.genre?.name)
                    .filter(genre => genre && genre !== 'Undefined'); //Chatgpt visade hur man filtrerar bort undefined men eftersom det inte var ett värde så var jag tvungen att sätta det som en string. nr 3

                const singleGenres = [...new Set(genres)]; //chatgpt nr 4
                setGenres(singleGenres.length > 0 ? singleGenres : ["Ingen genre tilgjengelig"]);

                const passes = events.map(event => ({
                    id: event.id,
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

            <section>

                <article>
                    
                    <h3>Sjanger: </h3>

                    <ul>
                        {genres.map((genre, index) => (
                            <li key={index}>{genre}</li>
                        ))}
                    </ul>

                </article>

                <article>

                    <h3>Følg oss på sosiale medier:</h3>

                </article>
            </section>


            {festivalPasses.length > 0 && (
                <section>
                    <h2>Festivalpass:</h2>
                    {festivalPasses.map(pass => (
                        <EventCard key={pass.id} event={pass} />
                    ))}
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