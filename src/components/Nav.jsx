import React from "react";
import { Link } from "react-router-dom";
import categories from "./DataCategory";
import '../styles/header.scss'


export default function Nav() {
    return (
        <nav className="nav">
          {/* Green buttons centered */}
          <div className="nav_category_wrapper">
            <Link to="/category/musikk" className="nav_category">
              Musikk
            </Link>
            <Link to="/category/sport" className="nav_category">
              Sport
            </Link>
            <Link to="/category/teater-show" className="nav_category">
              Teater/Show
            </Link className="nav_logginn_wrapper">
          </div>
          {/* Purple button to the right */}
          <div>
            <Link to="/dashboard" className="nav_logginn">
              Logg inn
            </Link>
          </div>
        </nav>
    );
}