import { useEffect, useState } from "react";
import { client } from "../sanityClient";
import '../styles/dashboard.scss'
import "../styles/header.scss"



export default function Dashboard() {
    
    const [userLogin, setUserLogin] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await client.fetch(`*[_type == "bruker"]{
                    _id,
                    username,
                    name,
                    email,
                    age,
                    image {
                        asset -> {
                            url
                        }
                    }
                }`);
                setAllUsers(data);
            } catch (error) {
                console.error("Skjedde noe feil ved fetch av brukene", error);
            }
        };
        getUsers();
    }, []);

    useEffect(() => {
        const storedLogin = localStorage.getItem("login");
        const storedUserId = localStorage.getItem("userId");

        if (storedLogin === "true" && storedUserId) {
            client.fetch(`*[_type == "bruker" && _id == "${storedUserId}"][0]{
                _id,
                username,
                name,
                email,
                age,
                image {
                    asset -> {
                        url
                    }
                }
            }`).then((user) => {
                if (user) {
                    setIsLoggedIn(true);
                    setCurrentUser(user);
                }
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLogin((prev) => ({...prev, [name]: value}));
    };

    const handleClick = (e) => {
        e.preventDefault();
        const matchedUser = allUsers.find(
            (user) => user.username === userLogin.username
        );

        if (matchedUser) {
            setIsLoggedIn(true);
            setCurrentUser(matchedUser);
            localStorage.setItem("login", "true");
            localStorage.setItem("userId", matchedUser._id);
            setError("");
        } else {
            setError("Finner inget konto koblet til dette brukernavn");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    return (
       <div className="dashboard-container">
            {!isLoggedIn ? (
                <section className="login-section">
                    <h2>Logg inn</h2>
                    <form className="login-form">
                        <label className="login-label">
                            Brukernavn
                            <input 
                            type="text"
                            name="username"
                            placeholder="olaNordmann123"
                            onChange={handleChange}
                            className="login-input"
                            />
                        </label>

                        <button className="login-button" onClick={handleClick}>Logg inn</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </section>
            ) : ( 
                <section className="user-dashboard">
                    <article className="user-profile">
                        <h1>Min side</h1>
                        <h2 className="user-name">{currentUser?.name}</h2>
                        {currentUser?.image?.asset?.url && <img className="user-image" src={currentUser?.image?.asset?.url} alt={currentUser?.name} />}
                        <p className="user-email">Email: {currentUser?.email}</p>
                        <p className="user-age">Alder: {currentUser?.age} år</p>
                        <button className="logout-button" onClick={handleLogout}>Logg ut</button>
                    </article>
                   
                   <article className="user-purchases">
                        <h2>Mine kjøp</h2>
                   </article>

                   <article className="user-wishlist">
                        <h2>Min ønskeliste</h2>
                   </article>
                </section>
            )}
       </div>
    );
}
