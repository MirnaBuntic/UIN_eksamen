import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import CategoryPage from "./components/CategoryPage";
import EventPage from "./components/EventPage";
import Dashboard from "./components/Dashboard";
import SanityEventDetails from "./components/SanityEventDetails";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/app.scss"



export default function App() {
  const [attractions, setAttractions] = useState([]);

  const getAttractions = async () => {

    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';
    const attractionId = [
      "K8vZ917K7fV", // Findings
      "K8vZ917_YJf", // Neon
      "K8vZ917bJC7", // Skeikampenfestivalen
      "K8vZ917oWOV" // Tons of Rock
    ];

    //Try..catch istället för .then...catch eftersom jag frågade chatgpt och den sa att det var bättre, mer läsbar kod osv. nr 1
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/attractions?apikey=${apiKey}&locale=*&id=${attractionId}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data._embedded) {
        setAttractions(data._embedded.attractions);
      }
    } catch (error) {
      console.error("Skjedde noe feil ved fetch")
    }
  };
  
  useEffect(() => {
    getAttractions();
  }, []);

  return (
   <Layout>
      <Routes>
        <Route path="/" element={<Home attractions={attractions} />}></Route>
        <Route path="/event/:slug" element={<EventPage attractions={attractions} />}></Route>
        <Route path="/category/:slug" element={<CategoryPage attractions={attractions}/>}></Route>
        <Route path="/dashboard" element={<Dashboard attractions={attractions}/>}></Route>
        <Route path="/sanity-event/:id" element={<SanityEventDetails />} />
      </Routes>
   </Layout>
  )
}

