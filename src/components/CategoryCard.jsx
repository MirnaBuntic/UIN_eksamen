import React from "react";

export default function CategoryCard ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);

    const imageUrl = item.images?.[0].url || "";
    const name = item.name || "Uten navn";
    const venue = item.name || item.address?.line1 || "sted ikke tilgjengelig";
    const date = item.date || "Ukjent dato";
    const country = item._embedded?.venues?.[0]?.country?.name || "ukjent land";
    const city = item._embedded?.venues?.[0]?.city?.name


    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3>{name}</h3>
            <p>{venue}</p>
            <p>{date}</p>
            <p>{country}</p>
            <p>{city}</p>
            <button onClick= {onSave}>
                <i className= {isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
        </div>
    );
}