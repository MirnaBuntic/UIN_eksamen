
export default function ArtistCard({ artist }) {

    const imageUrl = artist?.images?.[0]?.url;
    const name = artist?.name;

    return (
        <figure>
            {imageUrl && <img src={imageUrl} alt={name} />}
            <figcaption>{name}</figcaption>
        </figure>
    )

}