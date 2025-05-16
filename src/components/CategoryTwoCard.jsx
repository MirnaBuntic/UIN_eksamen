import "../styles/header.scss"

import React from "react";

export default function CategoryCardTwo ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);

    const imageUrl = item.images?.[0].url || "https://fakeimg.pl/600x400?text=No+image+found";
    const name = item.name || "Uten navn";
   

    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3>{name}</h3>
            <button onClick= {onSave}>
                <i className= {isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
        </div>
    );
}