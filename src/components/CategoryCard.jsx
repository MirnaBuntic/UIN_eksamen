import React from "react";

export default function CategoryCard ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);


    const {name, venue, date,city, country, images} = item;

    const imageUrl = images?.[0]?.url  || "";



    return (
        <div className="card">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3>{name || "ukjent navn"}</h3>
            <p>{venue || "ukjent sted"} </p>
            <p>{date || "ukjent dato"}</p>
            <p>{country || "ukjent land"}</p>
            <p>{city || "ukjent by"}</p>
            <button onClick= {onSave}>
                <i className= {isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
        </div>
    );


}