import { Link } from "react-router-dom";

//Tar emot props från home.jsx
export default function EventCard({ attraction, event, showButtons = true }) {
    
    //If test för att skilja på attraction del och event del
    //Här hade jag lite svårt att skilja på delarana när denna komponent skulle hålla på såpass mycket info.
    //Attraction delen står för hela "förstasidan" på eventpage dvs sommarens festivaler och hva skjer i verdens storbyer
    if (attraction) {

        //Variabel som håller bildens url från attractions objektet
        const imageUrl = attraction.images?.[0]?.url;

        //slug making
        const slug = attraction.name.toLowerCase().replace(/\s+/g, '-');
      
        //Variabler som håller datum, tid och platsinformation
        const eventDate = attraction.dates?.start?.localDate;
        const eventTime = attraction.dates?.start?.localTime;
        const venue = attraction._embedded?.venues?.[0];
        const city = venue?.city?.name;
        const country = venue?.country?.name;
        const venueName = venue?.name;
    
        //Checkar om det är ett event. Denna boolean har jag använt för att skiljer på den översta delen av "förstasidan" på eventpage som innehåller festivalkort,
        //och den nedre delen av sidan som innehåller sektionen med världens events
        const isEvent = Boolean(eventDate && eventTime && city && country);
    
        return (
            <>
                {!isEvent && (
                    <article aria-label={`Informasjon om attraksjon med navn: ${attraction.name}`} tabIndex="0">
                        {imageUrl && <img src={imageUrl} alt={`Bilde av ${attraction.name}`} />}
                        <h3 tabIndex="0">{attraction.name}</h3>
                        <Link to={`/event/${slug}`}
                        aria-label={`Les mer om ${attraction.name}`}>Les mer om {attraction.name}</Link>
                    </article>
                )}
    
                {isEvent && (
                    <article 
                        className="card"
                        aria-label={`Arrangement: ${attraction.name} i ${city}, ${country} på ${venueName}`} 
                        tabIndex="0">
                        {imageUrl && <img src={imageUrl} className="card-img" alt={`Bilde av ${attraction.name}`} />}
                        <h3 tabIndex="0">{attraction.name}</h3> 
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

    //Denna del visar festivalpassen
    if (event) {
        return (
            <article aria-label={`Informasjon om arrangement: ${event.name}`} tabIndex="0">
                {event.image && <img src={event.image} alt={`Bilde av ${event.name}`} />}
                <h3 tabIndex="0">{event.name}</h3>
                <div className="venue-date">
                    <p>{event.venue}</p>
                    <p>{event.date}</p>
                </div>
                {showButtons && (
                    <div className="button-flex"> 
                        <button type="button" aria-label={`Kjøp billetter til ${event.name}`} tabIndex ="0">Kjøp</button>
                        <button type="button" aria-label={`Legg til ${event.name} til i ønskelisten`} tabIndex="0">Legg til i ønskeliste</button>
                    </div>  
                )}   
            </article>
        )
    }

}