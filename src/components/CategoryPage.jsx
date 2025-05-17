import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "./DataCategory";
import "../styles/header.scss"
import "../styles/categorypage.scss"



//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter 
//https://react.dev/learn/choosing-the-state-structure#forms
//https://legacy.reactjs.org/docs/hooks-state.html


export default function CategoryPage ({ isLoggedIn }) {
  const { slug } = useParams ();
  const categoryName = categories.find(c => c.slug === slug)?.name || "Kategori";
  const [attractions, setAttractions] =useState([]);
  const [events, setEvents] =useState([]);
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState ({
    date: "",
    city: "",
    country: "",
    search: ""
  });

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("localWishlist")) || [];
  });

  const countryOptions = ["Norge", "Sverige", "Danmark"];
  const cityOptions = ["Oslo", "Stockholm", "København"];

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
    
    useEffect(() => {
      localStorage.setItem("localWishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
      if (!isLoggedIn) {
        setWishlist([]);
        localStorage.removeItem("localWishlist");
      }
    }, [isLoggedIn]);

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
          (!filters.city || city === filters.city) &&
          (!filters.country || country === filters.country) &&
          (!filters.search || name.includes(filters.search.toLowerCase()))
         )
          
        })
      };

      const filteredEvents = applyFilters(events);
      const filteredAttractions = applyFilters(attractions);
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

        <select 
          value={filters.city}
          onChange={(e) => setFilters({...filters, city: e.target.value })}>
            <option value="">Velg by</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
          </option>
            ))}
          </select>


          
        <select 
          value={filters.country}
          onChange={(e) => setFilters({...filters, country: e.target.value })}>
            <option value="">Velg land</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
          </option>
            ))}
          </select>
        

        

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
          {filteredAttractions.map((item) => (
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