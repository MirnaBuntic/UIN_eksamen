import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "./DataCategory";
import "../styles/header.scss"
import "../styles/categorypage.scss"



//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter 
//https://react.dev/learn/choosing-the-state-structure#forms
//https://legacy.reactjs.org/docs/hooks-state.html


export default function CategoryPage () {
  const { slug } = useParams ();
  const categoryName = categories.find(c => c.slug === slug)?.name || "Kategori";
  const [attractions, setAttractions] =useState([]);
  const [events, setEvents] =useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
 

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("localWishlist")) || [];
  });

  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";

  useEffect(() => {
    const fetchData = async () => {
      

      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
      //søkte på how can i turn & into url in javascript på google

        const url ="https://app.ticketmaster.com/discovery/v2/suggest";
        const params = `apikey=${apiKey}&locale=*&keyword=${encodeURIComponent(slug || "")}`;

  
        try {
          const attractionsRes = await fetch (`${url}?${params}&resource=attractions`);
          const attractionsData = await attractionsRes.json();
          setAttractions(attractionsData._embedded?.attractions || []);

          const venuesRes = await fetch (`${url}?${params}&resource=venues`);
          const venueData = await venuesRes.json();
          setVenues(venueData._embedded?.venues || []);



          const urlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&size=20&classificationName=${encodeURIComponent(slug || "")}`;

          const eventRes = await fetch (urlEvents);
          const eventData = await eventRes.json();
          setEvents(eventData._embedded?.events || []);
        } catch (error) {
          console.error("feil ved henting via suggest:", error)

        };

      }

        fetchData();
    }, [slug]);



    const fetchByCountry = async () => {
      if (!selectedCountry) return; 

      const baseUrl = "https://app.ticketmaster.com/discovery/v2";
      try{
        const params = `apikey=${apiKey}&locale=*&countryCode=${encodeURIComponent(selectedCountry)}&size=20`;

        const [attractionRes, venuesRes, eventRes] = await Promise.all([
          fetch(`${baseUrl}/attractions.json?${params}`),
          fetch(`${baseUrl}/venues.json?${params}`),
          fetch(`${baseUrl}/events.json?${params}`)
       
        ]);

        const [attractionsData, venuesData, eventsData] = await Promise.all([
          attractionRes.json(),
          venuesRes.json(),
          eventRes.json()
        ]);

        const filteredAttractions = (attractionsData._embedded?.attractions || []).filter(attraction => {
          const venueCountryCode = attraction._embedded?.venues?.[0]?.country?.countryCode || "";
          return venueCountryCode.toUpperCase() === selectedCountry.toUpperCase();
        })
        setAttractions(filteredAttractions);
        setVenues(venuesData._embedded?.venues || []);
        setEvents(eventsData._embedded?.events || []);
      } catch (error) {
        console.error("Error fetching data by country:", error);
      }
    };
    
    useEffect(() => {
      localStorage.setItem("localWishlist", JSON.stringify(wishlist));
    }, [wishlist]);
;

    const toggleWishlist = (id) => {
      setWishlist((prev) =>
      prev.includes(id)? prev.filter((x) => x !== id) : [...prev, id]
      );
    };


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
              date: item.dates?.start?.localDate,
              time: item.dates?.start?.localTime,
              venue: item._embedded?.venues?.[0]?.name,
              city: item._embedded?.venues?.[0]?.city?.name,
              country: item._embedded?.venues?.[0]?.country?.name}}
            isSaved={wishlist.includes(item.id)}
            onSave={() => toggleWishlist(item.id)}
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