import React from "react";


//Definerer og eksporterer en komponent med 3 props, item (en event, attraksjon eller spillested) en boolean som indikerer om jeg har lagret produktet og onSave.
//Consol logger også slik at jeg ser hvilken data som blir mottatt og hvilke produkter som evnentuelt er lagret.
export default function CategoryCard ({item, isSaved, onSave}) {
    console.log("CategoryCard mottar dette:", item);
    console.log(`${item.name} er ${isSaved ? "lagret" : "ikke lagret"}`);


    //lager en variabel som løser opp verdien fra item så jeg kan referere til de kun med navn senere
    const {name, venue, date,city, country, images} = item;
    
    
    
    //får ut url fra første image i arrayen item (event, attraksjon, spillested). 
    //Hvis ingen bilder finnes har jeg lagt inn en fake placeholder slik at utseende på kortet
    //ikke blir uten bilde og ser rotete ut.
    //https://betterplaceholder.com/ fake placeholder
    const imageUrl = images?.[0]?.url  || "https://fakeimg.pl/600x400?text=no+img"; 


    //Kortet returnerer bilde dersom ImageUrl finnes, navn på event/attraksjon/spillested
    //dato, by og land. Dersom ikke den informasjoenn finnes får man en fallback tekst.
    return (
        <div className="card" tabIndex="0">
            {imageUrl && <img src={imageUrl} className="card-img"/> }
            <h3 tabIndex="0">{name || "ukjent navn"}</h3>
            <p>{venue || "ukjent sted"} </p>
            <p>{date || "ukjent dato"}</p>
            <p>{country || "ukjent land"}</p>
            <p>{city || "ukjent by"}</p>
            {/*Knappe-element som trigges ved ett klikk og kjører funksjonen onSave*/}
            <button onClick= {onSave}>
                {/*Viser et hjerteikon. Det er farget/fylt som en indikasjon på at det er lagret eller ikke hvis det ikke er lagret*/}
                <i className= {isSaved ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
        </div>
    );


}