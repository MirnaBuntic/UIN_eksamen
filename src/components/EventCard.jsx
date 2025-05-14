import { Link } from "react-router-dom";

export default function EventCard({ attraction, event }) {
    
    if (attraction) {

        const imageUrl = attraction.images?.[0]?.url;
        const slug = attraction.name.toLowerCase().replace(/\s+/g, '-');
      
        const eventDate = attraction.dates?.start?.localDate;
        const eventTime = attraction.dates?.start?.localTime;
        const venue = attraction._embedded?.venues?.[0];
        const city = venue?.city?.name;
        const country = venue?.country?.name;
        const venueName = venue?.name;
    
        const isEvent = Boolean(eventDate && eventTime && city && country);
    
        return (
            <>
                {!isEvent && (
                    <article>
                        {imageUrl && <img src={imageUrl} alt={attraction.name} />}
                        <h3>{attraction.name}</h3>
                        <Link to={`/event/${slug}`}>Les mer om {attraction.name}</Link>
                    </article>
                )}
    
                {isEvent && (
                    <article className="card">
                        {imageUrl && <img src={imageUrl} className="card-img" alt={attraction.name} />}
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

    if (event) {
        return (
            <article>
                {event.image && <img src={event.image} alt={event.name} />}
                <h3>{event.name}</h3>
                <p>{event.venue}</p>
                <p>{event.date}</p>
                <p>Kjøp</p>
                <p>Legg til i ønskeliste</p>
            </article>
        )
    }

}