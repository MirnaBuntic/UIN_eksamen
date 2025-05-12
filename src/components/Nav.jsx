import React from "react";
import { Link } from "react-router-dom";
import categories from "./DataCategory";
import '../styles/header.scss';

export default function Nav() {
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
                Logg inn
            </Link>
          </div>
        </nav>
    );
}
