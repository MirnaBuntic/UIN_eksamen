import { Link } from "react-router-dom";
import '../styles/citycard.scss'


export default function EventCard({ attraction, event, showMoreLink = true }) {
    
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
    
        if (attraction) {
            return (
                <div className="event-card-container">
                    <article className="event-card">
                        {attraction.images?.[0]?.url && (
                            <img src={attraction.images[0].url} alt={attraction.name} />
                        )}
                        <h3>{attraction.name}</h3>
                        <p>{attraction.dates?.start?.localDate}</p>
                        <p>{attraction.dates?.start?.localTime}</p>
                        <p>{attraction._embedded?.venues?.[0]?.city?.name}</p>
                        <p>{attraction._embedded?.venues?.[0]?.country?.name}</p>
                        {showMoreLink && (
                            <Link to={`/event/${attraction.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                Les mer om {attraction.name}
                            </Link>
                        )}
                    </article>
                </div>
            );
        }
        
                
                {event && (
                    <article className="event-card">
                        {event.image && <img src={event.image} alt={event.name} />}
                        <h3>{event.name}</h3>
                        <p>{event.venue}</p>
                        <p>{event.date}</p>
                        <Link to={`/event/${event.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            Kjøp billetter
                        </Link>
                    </article>
                )}
           
        
    }
    }