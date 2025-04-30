import { Link } from "react-router-dom";
import EventCard from "./EventCard.";

export default function Home({ attractions }) {

    return (
        <section>
            <h1>Sommerens festivaler!</h1>
            {attractions?.map((attraction) => (
                <EventCard key={attraction.id} attraction={attraction} />
            ))}
        </section>
    );
}