import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "./DataCategory";

export default function CategoryPage () {
  const { slug } = useParams ();

  
  const [events, setEvents] =useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    city: "",
    country: "",
    date: "",
  });

  const [wishlist, setWishlist] = useState ([]);


  const apiKey = "4P5afjX98PHm5yhdSLbee6G9PVKAQGB7";

  useEffect(() => {
    const fetchData = async () => {
      let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&locale=*&size=20`;
      
      if (filters.keyword || slug) {
        url +=`&keyword=${filters.keyword || slug}`;
      } 

      //brukt chatgpt til å legge til keyword, lagt til i kilder
      url += `&classificationName=Music, Festival`;

      if (filters.city) {
        url +=`&city=${filters.city}`;
      }

      if (filters.country) {
        url +=`&countryCode=${filters.country}`;
      } 

      if (filters.date) {
        url +=`&startDateTime=${filters.date}T00:00:00Z`;
      }

      try {
        const res = await fetch (url);
        const data= await res.json();
        setEvents(data._embedded?.events || []);
      } catch (error) {
        console.error("feil ved henting av data:", error);
      }
    };

    fetchData();
    }, [slug, filters]);

    //https://handsonreact.com/docs/state#:~:text=Setting%20state%20based%20on%20prior%20state%20requires%20passing%20a%20function,updater%20function%20(setX%20function).
    //https://stackoverflow.com/questions/64104801/change-the-state-based-on-the-previous-state-with-react-hooks
    const handleChange = (e) => {
      const {name, value} = e.target;
      setFilters((prev) => ({...prev, [name]: value}));
    };
    

    const toggleWishlist = (id) => {
      setWishlist((prev) =>
      prev.includes(id)? prev.filter((x) => x !== id) : [...prev, id]
    );
    };
    
  return (
    <>

      <h1>{slug.toUpperCase()}</h1>

      <div className="filters">
        <input 
          type="text"
          name="keyword"
          placeholder="Søk her"
          value={filters.keyword}
          onChange={handleChange}
        />

      <input 
        type="text"
        name="city"
        placeholder="By"
        value={filters.city}
        onChange={handleChange}
      />

        <input 
          type="text"
          name="country"
          placeholder="Landskode (eks. NO)"
          value={filters.country}
          onChange={handleChange}
        />

        <input 
          type="date"
          name="date"
          placeholder="00.00.0000"
          value={filters.date}
          onChange={handleChange}
        />
      </div>

      <section className="flex-section">
        {events.map((item) => (
        <CategoryCard
        key={item.id}
        item={item}
        isSaved={wishlist.includes(item.id)}
        onSave={() => toggleWishlist(item.id)}
        />
      ))}
      </section>

    </>
  );
}

