import { useState, useEffect } from "react";
import EventCard from "./EventCard";

export default function Home({ attractions }) {

    const [events, setEvents] = useState([]);
    const [city, setCity] = useState("Oslo");
    
    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';
    const cities = [
        "Oslo",
        "Stockholm",
        "Berlin",
        "London",
        "Paris"
    ]

    const getEvents = async (cityName) => {
        //Chat gpt, samma metod som i app.jsx
        try {
            const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${cityName}&size=10`;
            const response = await fetch(url);
            const data = await response.json();

            if (data._embedded && data._embedded.events) {
                setEvents(data._embedded.events);
            }
        } catch (error) {
            console.error("Skjedde noe feil ved fetch av events", error);
        }
    };

    useEffect(() => {
        getEvents(city);
    }, [city]);

    return (
        <>
            <section>
                <h1>Sommerens festivaler!</h1>
                {attractions?.map((attraction) => (
                    <EventCard key={attraction.id} attraction={attraction} />
                ))}
            </section>

            <section>
                <h2>Hva skjer i verdens storbyer!</h2>

                <div>
                    {cities.map((cityName) => (
                        <button key={cityName} onClick={() => setCity(cityName)}>
                            {cityName}
                        </button>
                    ))}
                </div>

                <h3>Hva skjer i {city}</h3>

                <div>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} attraction={event} />
                        ))
                    ) : (
                        <p>Ingen events funnet i {city}.</p>
                    )}
                </div>
            </section>
        </>
    );
}