import { Link } from "react-router-dom";

export default function EventCard({ attraction, type }) {
    console.log("Riktig eventcard for event:", attraction.name);

    const imageUrl = attraction.images?.[0]?.url;
    const slug = attraction.name.toLowerCase().replace(/\s+/g, '-');
  
    const eventDate = attraction.dates?.start?.localDate;
    const eventTime = attraction.dates?.start?.localTime;
    const venue = attraction._embedded?.venues?.[0];
    const city = venue?.city?.name;
    const country = venue?.country?.name;
    const venueName = venue?.name;

    return (
        <>
            {type === "festival" && (
                <article>
                    {imageUrl && <img src={imageUrl} alt={attraction.name} />}
                    <h3>{attraction.name}</h3>
                    <Link to={`/event/${slug}`}>Les mer om {attraction.name}</Link>
                </article>
            )}

            {type === "event" && (
                <article>
                    {imageUrl && <img src={imageUrl} alt={attraction.name} />}
                    <h3>{attraction.name}</h3> 
                    <p>{eventDate}</p>
                    <p>{eventTime}</p>
                    <p>{country}</p>
                    <p>{city}</p>
                    <p>{venueName ? venueName : "Stedinformasjon vil bli tilgjengelig snart"}</p>
                </article>
            )}
        </>
    );
}