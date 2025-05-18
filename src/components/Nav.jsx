import { Link } from "react-router-dom";
import categories from "./DataCategory";
import '../styles/header.scss';

//Hämtar prop från app.jsx för att se om en brukere är inloggad eller inte
export default function Nav({ isLoggedIn }) {

    return (
        <nav className="nav" aria-label="Hovedmeny">
          <div className="nav_category_wrapper">

            {/*Loopar igenom alla kategorier i categories och skapar en länk för dessa*/}
            {categories.map((category) =>  (
                <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="nav_category"
                aria-label={`Gå til ${category.name}`}
                >
                    {category.name}
                </Link>
            ))}

        {/*Länk som ändrar text beroende på om man är inloggad eller inte*/}
            <Link to="/dashboard" className="nav_logginn" aria-label="Gå til innloggingsside">
                {isLoggedIn ? "Min side" : "Logg inn"}
            </Link>
          </div>
        </nav>
    );
}
