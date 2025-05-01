import { Link } from "react-router-dom";

export default function EventCard({ attraction }) {
    console.log("Riktig eventcard for event:", attraction.name);

    const imageUrl = attraction.images?.[0]?.url;
    const slug = attraction.name.toLowerCase().replace(/\s+/g, '-');


return (
    <article>
        {imageUrl && <img src={imageUrl} alt={attraction.name} />}
        <h2>{attraction.name}</h2>
        <Link to={`/event/${slug}`}>Les mer om {attraction.name}</Link>
    </article>
);

}