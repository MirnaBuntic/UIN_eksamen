import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import CategoryPage from "./components/CategoryPage";
import EventPage from "./components/EventPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    //Try..catch istället för .then...catch eftersom jag frågade chatgpt och den sa att det var bättre, mer läsbar kod osv.
    try {
      const apiKey = "TMg5Ty2vSaGfUDp1N53C4XG6tuaK762c";
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}`
      );

      const data = await response.json();
      if (data._embedded) {
        setEvents(data._embedded.events);
      } else {
        console.log("Finner ingen events")
      }
    } catch (error) {
      console.error("Skjedde noe feil ved fetch")
    }
  };
  
  useEffect(() => {
    getEvents();
  }, []);

  return (
   <Layout>
      <Routes>
        <Route path="/" element={<Home events={events} />}></Route>
        <Route path="/event/:id" element={<EventPage events={events} />}></Route>
        <Route path="/category/:slug" element={<CategoryPage events={events}/>}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
   </Layout>
  )
}

export default App
