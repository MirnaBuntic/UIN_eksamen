import { useParams } from "react-router-dom";

export default function EventPage({ attractions }) {

    const { slug } = useParams();

    const attraction = attractions.find(attraction =>
        attraction.name.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (!attraction) {
        return null;
    }

    return (
        <article>
            <h2>{attraction.name}</h2>
        </article>
    );
}