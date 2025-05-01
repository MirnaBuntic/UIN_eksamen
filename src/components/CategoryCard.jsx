

export default function CategoryCard ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);

    const imageUrl = item.images?.[0].url || "";
    const venue = item._embedded?.venues?.[0]?.name || "Ukjent sted";
    const date = item.dates?.start?.localDate || "Ukjent dato";

    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3>{item.name}</h3>
            <p>{venue}</p>
            <p>{date}</p>
            <button onClick= {onSave}></button>
        </div>
    );
}