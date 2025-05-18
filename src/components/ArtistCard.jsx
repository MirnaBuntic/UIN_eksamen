//Hämtar prop från eventpage
export default function ArtistCard({ artist }) {

    //Variabler för bild och namn på artister
    const imageUrl = artist?.images?.[0]?.url;
    const name = artist?.name || "Ukjent artist";

    return (
        //Använt figure för att gruppera bild och bildtext för att göra det så semantiskt rätt som möjligt
        <figure aria-label={`Artist: ${name}`}>
            {imageUrl && <img src={imageUrl} alt={name} />}
            <figcaption>{name}</figcaption>
        </figure>
    )

}