import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
    const categories = [
        {
            id: 1,
            name: "Musikk",
            slug: "musikk"
        },
        {
            id: 2,
            name: "Sport",
            slug: "sport"
        },
        {
            id: 3,
            name: "Teater/Show",
            slug: "teater"
        }
    ];

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Forside</Link>
                </li>
                {categories.map((category) => (
                    <li key={categories.id}>
                        <Link to={`/category/${category.slug}`}>{category.name}</Link>
                    </li>
                ))}
                <li>
                    <Link to= "/dashboard">Min side</Link>
                </li>
            </ul>
        </nav>
    );
}