import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categories from "./DataCategory";
import '../styles/header.scss';

export default function Nav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem("login") === "true";
        setIsLoggedIn(loggedIn);
    }, []);

    return (
        <nav className="nav">
          <div className="nav_category_wrapper">
            {categories.map((category) =>  (
                <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="nav_category"
                >
                    {category.name}
                </Link>
            ))}

            <Link to="/dashboard" className="nav_logginn">
                {isLoggedIn ? "Min side" : "Logg inn"}
            </Link>
          </div>
        </nav>
    );
}
