import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard";
import EventCard from "./EventCard";
import "../styles/citycard.scss"
import "../styles/header.scss"
import "../styles/Eventpage.scss"

//Tar emot attractions som prop från app.jsx
export default function EventPage({ attractions }) {

    //Hämtar slug från url:en /event/:slug
    const { slug } = useParams();
    //State-variabel för genrer
    const [genres, setGenres] = useState([]);
    //State-variabel för sociala medier
    const [socialMedia, setSocialMedia] = useState([]);
    //State-variabel för festivalpass
    const [festivalPasses, setFestivalPasses] = useState([]);
    //State-vaariabel för artister
    const [artists, setArtists] = useState([]);

    //Slug making. Hittar attraktionen och omvandlar namn till små bokstäver och byter mellanrum till "-"
    const attraction = attractions.find(attraction =>
        attraction.name.toLowerCase().replace(/\s+/g, '-') === slug
    );

    //Asykron funktion för att hämta data från api baserat på attraction id
    const getFestivalData = async () => {
        //Checkar om det finns attrationer, annars avbryts funktionen
        if (!attraction) return;

        const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7"; //api nyckel
        //Https url
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&attractionId=${attraction.id}`;

        //Chat gpt, samma metod som i app.jsx nr1
        try {
            //hämtar data och omvandlar till json format
            const response = await fetch(url);
            const data = await response.json();

            //Hämtar eventlistan från data eller en tom array om det inte finns någon lista
            const events = data._embedded?.events || [];

            //Hämtar genre genom att gå igenom event och se efter genre. Genrer som heter undefiend filtreras bort
            const genres = events
                .map(event => event.classifications?.[0]?.genre?.name)
                .filter(genre => genre && genre !== 'Undefined'); //Här var jag tvungen att filtrera bort en string som heter undefiend efter som det tydligen inte var ett värde, utan just en string på ticketmaster.
            //Tar bort dubletter. alltså genre med samma namn
            const singleGenres = [...new Set(genres)]; //chatgpt nr 3
            setGenres(singleGenres.length > 0 ? singleGenres : ["Ingen genre tilgjengelig"]);

            //Hämtar sociala medielänkar, finns det inget så kommer det inte upp något alls
            const socialLinks = events[0]?._embedded?.attractions[0]?.externalLinks || {};
            setSocialMedia(socialLinks);

            //Const variabel som håller på festivalpassen. Relevant info mappas fram från event
            const passes = events.map(event => ({
                id: event.id,
                name: event.name,
                image: event.images?.[0]?.url,
                date: event.dates?.start?.localDate,
                venue: event._embedded?.venues?.[0]?.name,
            }));
            setFestivalPasses(passes);

            //Hämtar artister 
            const artistList = events[0]?._embedded?.attractions || [];
            setArtists(artistList);

            //Catch för att få meddelande om errors i konsollen
        }   catch (error) {
            console.error("Skjedde noe feil ved fetch av artister", error);
        }
    };

    //useEffect körs vid första rendering eller när attraction ändras.
    useEffect(() => {
        getFestivalData();
    }, [attraction]);

    //Om det inte finns någon attraktion visas detta felmeddelande
    if (!attraction) {
        return <p>Ingen festival funnet. </p>;
    }

    return (
        <>
            {/*Brödsmulestig för att göra det tydligt för brukaren vart man befinner sig och ger möjlighet för att ta sig tillbaka till föregående sida*/}
            <nav aria-label="Brødsmulesti">
                <ul>
                    <li>
                        <Link to="/" aria-label="Gå til startsiden">Startsiden</Link>
                    </li>
                    <li aria-hidden="true">{">"}</li>
                    <li aria-current="page" tabIndex="0">{attraction.name}</li>
                </ul>
            </nav>

            <h2>{attraction.name}</h2>

            {/*Sektion för genre */}
            <section aria-label="Informasjon om sjanger og sosiale medier">
                <article className="Sjanger" aria-label="Sjangere" tabIndex="0">
                    <h3>Sjanger:</h3>
                    <ul>
                        {/*Loopar genom genre och visar i listan*/}
                        {genres.map((genre, index) => (
                            <li key={index}>{genre}</li>
                        ))}
                    </ul>
                </article>

                {/*Sektion för sociala medier*/}
                {/*Fick hjälp av chatgpt med användningen av object.keys för att få det som var i console logen synligt på sidan. nr4*/}
                {/*Anledningen till att jag använder object.keys är för att socialmedia är ett object och inte en array, därav kan jag inte loopa över direkt med .map*/}
                <article className="SoMe" aria-label="Festivalens sosiale medier">
                    <h3>Følg oss på sosiale medier:</h3>
                    {/*Om länkar finns så visas de här*/}
                    {Object.keys(socialMedia).length > 0 ? (
                        <ul>
                            {/*Loopar genom plattformar och genererar länkar*/}
                            {Object.keys(socialMedia).map((platform, index) => (
                                <li key={index}>
                                    <a href={socialMedia[platform][0].url} aria-label={`Besøk vår ${platform}-side`}>{platform}</a>
                                </li>
                            ))}
                        </ul>
                    ):(
                        //Detta meddelande visas om inga sociala medier finns
                        <p>Ingen sociale medier tilgjengelig</p>
                    )}
                </article>
              
            </section>

            {/*Sektion för festivalpass*/}
            {festivalPasses.length > 0 && (
                <section className="festivaler" aria-label="Festivalpass"> 
                    <h2>Festivalpass:</h2>
                    {/*Loopar genom varje festivalpass och visar de med eventcard*/}
                    {festivalPasses.map(pass => (
                        <EventCard key={pass.id} event={pass} />
                    ))}
                </section>
            )}

            {/*Sektion för artister*/}
            {artists.length > 0 && (
                <section className="artister" aria-label="Liste over artister">
                    <h2>Artister:</h2>
                    <ul>
                        {/*Loopar genom artister och visar varje artist med artistcard*/}
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