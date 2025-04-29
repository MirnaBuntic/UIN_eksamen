import React from "react";
import { Link } from "react-router-dom";
import categories from "./DataCategory";

export default function Nav() {
    return (
        <nav>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <Link to={`/category/${category.slug}`}>{category.name}</Link>
                    </li>
                ))}
                <li>
                    <Link to= "/dashboard">Logg inn</Link>
                </li>
            </ul>
        </nav>
    );
}