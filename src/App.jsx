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
  //Variabel för att hämta attractions
  const [attractions, setAttractions] = useState([]);
  //Variabel för att checka om brukeren är inloggad eller inte.
  //Det läser från localStorage vid start
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("login") === "true"
  );

  //Funktion för att hämta festivaldata
  const getAttractions = async () => {

    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7'; //api nyckel

    //Variabeln som håller de id:erna jag vill hämta från api:et
    const attractionId = [
      "K8vZ917K7fV", // Findings
      "K8vZ917_YJf", // Neon
      "K8vZ917bJC7", // Skeikampenfestivalen
      "K8vZ917oWOV" // Tons of Rock
    ];

    //Try..catch istället för .then...catch eftersom jag frågade chatgpt och den sa att det var bättre, mer läsbar kod osv. nr 1
    try {
      const url = `https://app.ticketmaster.com/discovery/v2/attractions?apikey=${apiKey}&locale=*&id=${attractionId}`;

      //Hämtar data och omvandlar till json format
      const response = await fetch(url);
      const data = await response.json();

      //Om data finns så uppdateras attractions staten med dessa uppgifter.
      //Använder embedded då ticketmaster lägger vissa detaljer innanför detta objekt
      if (data._embedded) {
        setAttractions(data._embedded.attractions);
      }
    //Catch för att fånga eventuella fel och meddela detta i konsollen
    } catch (error) {
      console.error("Skjedde noe feil ved fetch")
    }
  };
  
  //useEffect körs när komponeten renderas första gången
  useEffect(() => {
    getAttractions();
  }, []);

  //Routar och skickar eventuella props om vissa komponenter ska använda sig av samma saker
  return (
   <Layout isLoggedIn={isLoggedIn}>
      <Routes>
        <Route path="/" element={<Home attractions={attractions} />}></Route>
        <Route path="/event/:slug" element={<EventPage attractions={attractions} />}></Route>
        <Route path="/category/:slug" element={<CategoryPage isLoggedIn={isLoggedIn}/>}></Route>
        <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}></Route>
        <Route path="/sanity-event/:id" element={<SanityEventDetails />} />
      </Routes>
   </Layout>
  )
}

