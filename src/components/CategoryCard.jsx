import React from "react";

export default function CategoryCard ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);

    const imageUrl = item.images?.[0]?.url || "";
    const name = item.name || "Uten navn";
    const venue = item.venue || "Sted ikke tilgjengelig";
    const date = item.date || "Ukjent dato";
    const city = item.city || "Ukjent by";
    const country = item.country || "Ukjent land";



    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3>{name}</h3>
            <p>{venue}</p>
            <p>{date}</p>
            <p>{country}, {city}</p>
            <button onClick= {onSave}>
                <i className= {isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
        </div>
    );
}