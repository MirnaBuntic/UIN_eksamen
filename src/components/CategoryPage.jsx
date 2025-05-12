import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "./DataCategory";
import CategoryCardTwo from "./CategoryTwoCard";




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


  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";


  const [search, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");
  


  useEffect(() => {
    const fetchData = async () => {
      
      if (!slug && !search && !filterCity && !filterCountry && !filterDate) return;
      
        const url ="https://app.ticketmaster.com/discovery/v2/suggest";
        const params = `apikey=${apiKey}&locale=*&keyword=${slug || ""}`;
      
        try {
          const attractionsRes = await fetch (`${url}?${params}&resource=attractions`);
          const attractionsData = await attractionsRes.json();
          setAttractions(attractionsData._embedded?.attractions || []);

          const venuesRes = await fetch (`${url}?${params}&resource=venues`);
          const venueData = await venuesRes.json();
          setVenues(venueData._embedded?.venues || []);

          const urlEvents = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&size=20&classificationName=${slug || ""}`;

          const eventRes = await fetch (urlEvents);
          const eventData = await eventRes.json();
          setEvents(eventData._embedded?.events || []);
        } catch (error) {
          console.error("feil ved henting via suggest:", error)
        };

      }

        fetchData();
    }, [slug]);

    
    

    const toggleWishlist = (id) => {
      setWishlist((prev) =>
      prev.includes(id)? prev.filter((x) => x !== id) : [...prev, id]
    );
    };
    
  return (
    <>

      <h1>{categoryName}</h1>

      <div>
        
    

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />


        <input
          type="text"
          placeholder="Land"
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
        />

        <input
          type="text"
          placeholder="By"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        />
      



      </div>

      <section>
        <h2>Attraksjoner</h2>
        <div>
          {attractions.map((item) => (
            <CategoryCardTwo
            key={item.id}
            item={item}
            isSaved={wishlist.includes(item.id)}
            onSave={() => toggleWishlist(item.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2>Arrangementer</h2>
        <div>
          {events.map((item) => (
            <CategoryCard
            key={item.id}
            item={{
              ...item, 
              date: item.dates?.start?.localeDate,
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

      <section>
        <h2>Spillesteder</h2>
        <div>
          {venues.map((item) => (
            <CategoryCardTwo
            key={item.id}
            item={item}
            isSaved={wishlist.includes(item.id)}
            onSave={() => toggleWishlist(item.id)}
            />
          ))}
        </div>
      </section>

    </>
  );
}

