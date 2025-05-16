import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../sanityClient";
import '../styles/dashboard.scss'
import "../styles/header.scss"



export default function Dashboard() {
    
    const [userLogin, setUserLogin] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");
    const [wishListEvents, setWishListEvents] = useState([]);
    const [previousPurchaseEvents, setPreviousPurchaseEvents] = useState([]);
    const [sharedFriendsEvent, setSharedFriendsEvent] = useState({});
    const [attractions, setAttractions] = useState([]);

    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7';

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
                    },
                    wishList[]->{apiId},
                    previousPurchases[]->{apiId},
                    friends[]->{
                        _id,
                        name,
                        image {
                            asset -> { url }
                        },
                        wishList[]->{apiId}    
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
                },
                wishList[]->{apiId},
                previousPurchases[]->{apiId},
                friends[]->{
                    _id,
                    name,
                    image {
                        asset -> { url }
                    },
                    wishList[]->{apiId}    
                }
            }`).then((user) => {
                if (user) {
                    setIsLoggedIn(true);
                    setCurrentUser(user);
                    fetchEventDetails(user);
                }
            });
        }
    }, [attractions]);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?locale=*&apikey=${apiKey}`);
                if (response.ok) {
                    const data = await response.json();
                    const events = data._embedded?.events || [];
                    const findAttractions = events.map(event => ({
                        id: event.id,
                        name: event.name,
                        date: event.dates?.start?.localDate,
                        image: event.images?.[0]?.url,
                    }));
                    setAttractions(findAttractions);
                }
            } catch (error) {
                console.error("Skjedde noe feil ved henting av attractions", error);
            }
        };
        fetchAttractions();
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
        const localWishlistIds = JSON.parse(localStorage.getItem("localWishlist")) || [];

        const SanityWishlist = [];
        for (let id of sanityWishlistIds) {
            const event = await fetchSingleEvent(id);
            if (event) {
                SanityWishlist.push(event);
            }
        }

        const localWishlist = attractions.filter(item => localWishlistIds.includes(item.id));

        const wishListResult = [...SanityWishlist, ...localWishlist];

        const purchaseResult = [];
        for (let id of purchaseIds) {
            const event = await fetchSingleEvent(id);
            if (event) {
                purchaseResult.push(event)
            }
        }

        setWishListEvents(wishListResult);
        setPreviousPurchaseEvents(purchaseResult);

        const sharedEvents = {};
        
        for (let friend of user.friends || []) {
            const sharedEvent = wishListResult.filter(event =>
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
        localStorage.removeItem("localWishlist");
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
                            placeholder="leoAjkic123"
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
                        <article>
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
                                {wishListEvents.map(item => (
                                    <li key={item.id}>
                                        <img src={item.image} alt={item.name} />
                                        <h3>{item.name}</h3>
                                        <p>{item.date}</p>
                                        <Link to={`/sanity-event/${item.id}`}>Se mer om dette kjøpet</Link>
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
