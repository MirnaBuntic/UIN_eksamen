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
  const [wishlist, setWishlist] = useState ([]);
  const [filters, setFilters] = useState ({
    date: "",
    city: "",
    country: "",
    search: ""
  });

  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";

  useEffect(() => {

    const fetchData = async () => {
      try {
        
        const eventRes = await fetch (`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&classificationName=${slug}&size=20`);
        const eventData = await eventRes.json();
        setEvents(eventData._embedded?.events || []);

        const attractionRes = await fetch (`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&classificationName=${slug}&size=20`);
        const attractionData = await attractionRes.json();
        setAttractions(attractionData._embedded.events || []);


        const venuesRes = await fetch (`https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${apiKey}&keyword=${slug}&size=20`);
        const venueData = await venuesRes.json();
        setVenues(venueData._embedded?.venues || []);
      } catch (error) {
        console.error("Feil ved henting av data", error);
      }
    };

    fetchData();
  }, [slug]);
    
    
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
      //søkte på how can i turn & into url in javascript på google
    

    const toggleWishlist = (id) => {
      setWishlist((prev) =>
      prev.includes(id)? prev.filter((x) => x !== id) : [...prev, id]
    );
    };



    //https://stackoverflow.com/questions/66914812/filtering-data-using-react-hooks


      const applyFilters = (items) => {

        return items.filter((item) => {
          const name = item.name?.toLowerCase () || "";
          const city = item._embedded?.venues?.[0]?.city?.name?.toLowerCase() || item.city?.name?.toLowerCase() || "";
          const country = item._embedded?.venues?.[0]?.country?.name?.toLowerCase() || item.country?.name?.toLowerCase() || "";
          const date = item.dates?.start?.localeDate || "";

         return (
          (!filters.date || date === filters.date) &&
          (!filters.city || city.includes(filters.city.toLowerCase())) &&
          (!filters.country || country.includes (filters.country.toLowerCase())) &&
          (!filters.search || name.includes(filters.search.toLowerCase()))
         )
          
        })
      };

      const filteredEvents = applyFilters(events);
      const filteredAttrations = applyFilters(attractions);
      const filteredVenues = applyFilters (venues);


  return (
    <>

      <h1>{categoryName}</h1>

      <section className="filters">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({...filters, date: e.target.value})}
        />

        <input
          type="text"
          placeholder="By"
          value={filters.city}
          onChange={(e) => setFilters({...filters, city: e.target.value})}
        />

        <input
          type="text"
          placeholder="Land"
          value={filters.country}
          onChange={(e) => setFilters({...filters, country: e.target.value})}
        />

        <input
          type="text"
          placeholder="Søk"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />




      </section>

      <section className="Attraction">
        <h2>Attraksjoner</h2>
        <div>
          {filteredAttrations.map((item) => (
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
          {filteredEvents.map((item) => (
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
          {filteredVenues.map((item) => (
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