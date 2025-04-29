import { Link } from "react-router-dom";

export default function Home({ attractions }) {

    return (
        <section>
            <h1>Sommerens festivaler!</h1>

            {attractions?.map((attraction) => {
                const imageUrl = attraction.images && attraction.images.length > 0
                    ?attraction.images[0].url
                    : null;

                return (
                    <article key={attraction.id}>
                        {imageUrl && <img src={imageUrl} alt={attraction.name} />}
                        <h2>{attraction.name}</h2>
                        <Link to={`/event/${attraction.id}`}>Les mer om {attraction.name}</Link>
                    </article>
                );
            })}
        </section>
    );
}