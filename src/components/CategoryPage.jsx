import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";


export default function CategoryPage () {
  const { slug } = useParams ();

  const [attractions, setAttractions] =useState([]);
  const [events, setEvents] =useState([]);
  const [venues, setVenues] = useState([]);

  const [wishlist, setWishlist] = useState ([]);


  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";

  useEffect(() => {
    const fetchData = async () => {
      
        const url ="https://app.ticketmaster.com/discovery/v2/suggest";
        const params = `apikey=${apiKey}&locale=*&keyword=${slug || ""}`;

        try {
          const attractionsRes = await fetch (`${url}?${params}&resource=attractions`);
          const attractionsData = await attractionsRes.json();
          setAttractions(attractionsData._embedded?.attractions || []);

          const venuesRes = await fetch (`${url}?${params}&resource=venues`);
          const venueData = await venuesRes.json();
          setVenues(venueData._embedded?.venues || []);

          const eventsRes = await fetch (
           `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&keyword=${slug || ""}`
          );
          const eventData= await eventsRes.json();
          console.log("event data:", eventData);
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

      <h1>{slug?.toUpperCase() || "Kategori"}</h1>

      <section>
        <h2>Attraksjoner</h2>
        <div>
          {attractions.map((item) => (
            <CategoryCard
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
            item={item}
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
            <CategoryCard
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

