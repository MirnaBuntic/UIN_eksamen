import { useEffect, useState } from "react";
import { client } from "../sanityClient";

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
            setError("Finner inget konto koblet till dette brukernavn");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    return (
       <div>
            {!isLoggedIn ? (
                <section>
                    <h2>Logg inn</h2>
                    <form>
                        <label>
                            Brukernavn
                            <input 
                            type="text"
                            name="username"
                            placeholder="olaNordmann123"
                            onChange={handleChange}
                            />
                        </label>

                        <button onClick={handleClick}>Logg inn</button>
                    </form>
                    {error && <p>{error}</p>}
                </section>
            ) : ( 
                <section>
                    <h1>Min side</h1>
                    <p>{currentUser?.name}</p>
                    {currentUser?.image?.asset?.url && <img src={currentUser?.image?.asset?.url} alt={currentUser?.name} />}
                    <p>Email: {currentUser?.email}</p>
                    <p>Alder: {currentUser?.age} år</p>
                    <button onClick={handleLogout}>Logg ut</button>
                </section>
            )}
       </div>
    );
    
}