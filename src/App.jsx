import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import CategoryPage from "./components/CategoryPage";
import EventPage from "./components/EventPage";
import Dashboard from "./components/Dashboard";

function App() {

  return (
   <Layout>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/event/:id" element={<EventPage />}></Route>
        <Route path="/category/:slug" element={<CategoryPage />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
   </Layout>
  )
}

export default App
