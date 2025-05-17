import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../Sanity/sanityClient";
import '../styles/dashboard.scss'
import "../styles/header.scss"
import { fetchAllUsers, fetchUserById } from "../Sanity/sanityServices";



export default function Dashboard({ isLoggedIn, setIsLoggedIn }) {
    
    const [userLogin, setUserLogin] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState("");
    const [wishListEvents, setWishListEvents] = useState([]);
    const [previousPurchaseEvents, setPreviousPurchaseEvents] = useState([]);
    const [sharedFriendsEvent, setSharedFriendsEvent] = useState({});

    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchAllUsers(client);
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
            fetchUserById(client, storedUserId).then((user) => {
                if (user) {
                    setCurrentUser(user);
                    fetchEventDetails(user);
                }
            });
        }
    }, []);

    const fetchSingleEvent = async (apiId) => {
        if (!apiId) return null;
            
        try {
            const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${apiId}.json?apikey=${apiKey}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    date: data.dates?.start?.localDate,
                    image: data.images?.[0]?.url,
                };
            }
           
        } catch (error) {
            console.error("Skjedde noe feil ved henting av event", error);
            return null;
        }
    };

    const fetchEventDetails = async (user) => {
        const sanityWishlistIds = user.wishList?.map(item => item.apiId) || [];
        const purchaseIds = user.previousPurchases?.map(item => item.apiId) || [];
        
        const sanityWishlist = [];
        for (let id of sanityWishlistIds) {
            const event = await fetchSingleEvent(id);
            if (event) {
                sanityWishlist.push(event);
            }
        }

        const purchaseResult = [];
        for (let id of purchaseIds) {
            const event = await fetchSingleEvent(id);
            if (event) {
                purchaseResult.push(event)
            }
        }

        setWishListEvents(sanityWishlist);
        setPreviousPurchaseEvents(purchaseResult);

        const sharedEvents = {};
        for (let friend of user.friends || []) {
            const sharedEvent = sanityWishlist.filter(event =>
                friend.wishList?.some(friendEvent => friendEvent.apiId === event.id)
            );
            if (sharedEvent.length > 0) {
                sharedEvents[friend._id] = sharedEvent;
            }
        }
        setSharedFriendsEvent(sharedEvents);
    }

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
            fetchEventDetails(matchedUser);
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
        setWishListEvents([]);
        setPreviousPurchaseEvents([]);
        setSharedFriendsEvent([]);
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
                            placeholder="erlingHaaland123"
                            onChange={handleChange}
                            className="login-input"
                            />
                        </label>

                        <button className="login-button" onClick={handleClick}>Logg inn</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </section>
            ) : (
                <>
                    <section className="user-dashboard">
                        <article className="user-profile">
                            <h1>Min side</h1>
                            <h2 className="user-name">{currentUser?.name}</h2>
                            {currentUser?.image?.asset?.url && <img className="user-image" src={currentUser?.image?.asset?.url} alt={currentUser?.name} />}
                            <p className="user-email">Email: {currentUser?.email}</p>
                            <p className="user-age">Alder: {currentUser?.age} år</p>
                            <button className="logout-button" onClick={handleLogout}>Logg ut</button>
                        </article>
                    </section>

                    <section>
                        <article className="friends">
                            <h2>Mine venner</h2>
                            <ul>
                                {currentUser?.friends?.map(friend => (
                                    <li key={friend._id}>
                                        {friend.image?.asset?.url && (
                                            <img src={friend.image.asset.url} alt={friend.name} />
                                        )}
                                        <p>{friend.name}</p>
                                        {sharedFriendsEvent[friend._id]?.map(event => (
                                            <p key={event.id}>Du og {friend.name} har samme event i ønskelisten. Hva med å dra sammen på {event.name}?</p>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>
                
                    <section>
                        <article className="user-purchases">
                            <h2>Mine kjøp</h2>
                            <ul>
                                {previousPurchaseEvents.map(event => (
                                    <li key={event.id}>
                                        <img src={event.image} alt={event.name} />
                                        <h3>{event.name}</h3>
                                        <p>{event.date}</p>
                                        <Link to={`/sanity-event/${event.id}`}>Se mer om dette kjøpet</Link>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="user-wishlist">
                            <h2>Min ønskeliste</h2>
                            <ul>
                                {wishListEvents.map(event => (
                                    <li key={event.id}>
                                        <img src={event.image} alt={event.name} />
                                        <h3>{event.name}</h3>
                                        <p>{event.date}</p>
                                        <Link to={`/sanity-event/${event.id}`}>Se mer om dette kjøpet</Link>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>
                </>
            )}
       </div>
    );
}
