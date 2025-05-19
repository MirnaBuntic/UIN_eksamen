import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "./DataCategory";
import "../styles/header.scss"
import "../styles/categorypage.scss"




export default function CategoryPage () {

  //Henter slug fra URL via React router
  const { slug } = useParams ();
  //finner kategorinavn som matcher slug, hvis ikke det finnes så brukes kategori som fallback
  const categoryName = categories.find(c => c.slug === slug)?.name || "Kategori";
  //definnerer en state for tre datatyper som skal vise en liste over attraksjoner, arrangementer og spillesteder
  const [attractions, setAttractions] =useState([]);
  const [events, setEvents] =useState([]);
  const [venues, setVenues] = useState([]);
  //en state for land som kan brukes for filtrering
  const [selectedCountry, setSelectedCountry] = useState("");
 

  //api fra ticketmaster. 
  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";

  //use effect kjøres hver gang et komponenten blir lagt til i DOM eller slug endres
  useEffect(() => {
    const fetchData = async () => {
      

        //base url for suggest
        const url ="https://app.ticketmaster.com/discovery/v2/suggest";
        //her spør jeg api etter informasjonen jeg vil ha fra suggest. hvem/hva eventet er, hvilket språk (locale) og hva jeg søker etter (keyword).
        //api sender tilbake det jeg har spurt etter 
        //jeg brukte lang tid på å matche slug med spesial tegn (theatre & show). 
        //da søkte jeg: special character to url react og fikk opp denne kilde: 
        //spurte deretter chat hva encodeURIComponent var og svarene står i punkt 4 med chatgpt.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

        const params = `apikey=${apiKey}&locale=*&keyword=${encodeURIComponent(slug || "")}`;

  
        try {
          //slet lenge med å finne ut av hvorfor ikke alle fungerte og ville matche slug. i kildene ligger mye av hjelpen jeg fikk i punkt 3 med chatgpt.
          //henter attraksjoner som matcher slug
          const attractionsRes = await fetch (`${url}?${params}&resource=attractions`);
          const attractionsData = await attractionsRes.json();
          setAttractions(attractionsData._embedded?.attractions || []); //setter state for spillesteder


          //henter spillesteder som matcher slug
          const venuesRes = await fetch (`${url}?${params}&resource=venues`);
          const venueData = await venuesRes.json();
          setVenues(venueData._embedded?.venues || []); //setter state for spillesteder


          //bruker en annen url for å få tak på events da jeg ikke fikk det til med suggest....
          //henter ut arrangemnter som matcher slug
          const urlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&size=20&classificationName=${encodeURIComponent(slug || "")}`;

          const eventRes = await fetch (urlEvents);
          const eventData = await eventRes.json();
          setEvents(eventData._embedded?.events || []); //setter state for events
        } catch (error) {
          //logger eventuelle feil 
          console.error("feil ved henting:", error)

        };

      }

        fetchData(); //kjører funksjonen som henter all data 
    }, [slug]); //den kjøres på nytt hver gang slug endrer seg


    //funskjon som henter data basert på hvilket land en bruker velger
    const fetchByCountry = async () => {
      if (!selectedCountry) return; //gjør ingen ting hvis ikke land er valgt
      //baseurl
      const baseUrl = "https://app.ticketmaster.com/discovery/v2";
      try{
        //parametere for landsfiltrering er apikey, locale og maks antall resultater
        const params = `apikey=${apiKey}&locale=*&countryCode=${encodeURIComponent(selectedCountry)}&size=20`;

        //henter attraksjoner, spillesteder og arrangementer parrarelt
        const [attractionRes, venuesRes, eventRes] = await Promise.all([
          fetch(`${baseUrl}/attractions.json?${params}`),
          fetch(`${baseUrl}/venues.json?${params}`),
          fetch(`${baseUrl}/events.json?${params}`)
       
        ]);

        //leser JSON responenee parrarelt
        const [attractionsData, venuesData, eventsData] = await Promise.all([
          attractionRes.json(),
          venuesRes.json(),
          eventRes.json()
        ]);

        //prøvde å få til at attraksjoner skulle filtreres ordentlig, men det funket dessverre ikke helt som jeg ville.  
        //her har jeg prøvd å filtrere ytterligere på landet til spillestedet
        const filteredAttractions = (attractionsData._embedded?.attractions || []).filter(attraction => {
          const venueCountryCode = attraction._embedded?.venues?.[0]?.country?.countryCode || "";
          return venueCountryCode.toUpperCase() === selectedCountry.toUpperCase();
        })

        //oppdaterte state med filtrere attraksjoner, spillesteder og arrangementer
        setAttractions(filteredAttractions);
        setVenues(venuesData._embedded?.venues || []);
        setEvents(eventsData._embedded?.events || []);
      } catch (error) {
        console.error("Error fetching data by country:", error);
      }
    };
    
    //https://www.w3schools.com/js/js_json_stringify.asp
    //Hämtar data från localStorage och sparar i staten wishlist
    //Använder json.parse för att konvertera json string tillbaka till en js-object (array)
    const [wishlist, setWishlist] = useState(() => {
      return JSON.parse(localStorage.getItem("localWishlist")) || [];
    });

    //Varje gång wishlist ändras så sparas en ny verision till localStorage
    //json.stringify konverterar arrayen till wishlist som en string eftersom det bara är strings som kan sparas i localStorage
    useEffect(() => {
      localStorage.setItem("localWishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    //en funksjon for å legge til eller fjerne et element fra wishlist
    const toggleWishlist = (id) => {
      setWishlist((prev) =>
      prev.includes(id)? prev.filter((x) => x !== id) : [...prev, id]
      );
    };



    //returnerer slik som det skal vises i nettleseren
  return (
    <>

      <h1>{categoryName}</h1>


      <section className="country-selector">
        <label htmlFor="country">Velg land:</label>
        <select
        id="country"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">-- Velg land --</option>
          <option value="NO">Norge</option>
          <option value="SE">Sverige</option>
          <option value="DK">Danmark</option>
        </select>
        <button onClick={fetchByCountry} disabled={!selectedCountry}>
          Søk
        </button>
      </section>

      <section className="Attraction">
        <h2>Attraksjoner</h2>
        <div>
          {attractions.map((item) => (
            <CategoryCard
            key={item.id}
            item={{ ...item, 
              date: item.dates?.start?.localDate, //henter dato
              time: item.dates?.start?.localTime, //henter tid
              venue: item._embedded?.venues?.[0]?.name, //navn på spillested
              city: item._embedded?.venues?.[0]?.city?.name, //by
              country: item._embedded?.venues?.[0]?.country?.name}} //land
            isSaved={wishlist.includes(item.id)} //sjekker om elementet er lagret i wishlist
            onSave={() => toggleWishlist(item.id)} //klikkfunksjon for å lagre eller fjerne i wishlist
            />
          ))}
        </div>
      </section>

      <section className="Arrangement">
        <h2>Arrangementer</h2>
        <div>
          {events.map((item) => (
            <CategoryCard
            key={item.id}
            item={{
              ...item, 
              date: item.dates?.start?.localDate,
              time: item.dates?.start?.localTime,
              venue: item._embedded?.venues?.[0]?.name,
              city: item._embedded?.venues?.[0]?.city?.name,
              country: item._embedded?.venues?.[0]?.country?.name
            }}
            isSaved={wishlist.includes(item.id)}
            onSave={() => toggleWishlist(item.id)}
            />
          ))}
        </div>
      </section>


      
      <section className="Venues">
        <h2>Spillesteder</h2>
        <div>
          {venues.map((item) => (
            <CategoryCard
            key={item.id}
            item={{ ...item, 
              date: item.dates?.start?.localDate,
              time: item.dates?.start?.localTime,
              venue: item.name,
              city: item._embedded?.venues?.[0]?.city?.name,
              country: item._embedded?.venues?.[0]?.country?.name}}
            isSaved={wishlist.includes(item.id)}
            onSave={() => toggleWishlist(item.id)}
            />
          ))}
        </div>
      </section>

    </>
  );
}