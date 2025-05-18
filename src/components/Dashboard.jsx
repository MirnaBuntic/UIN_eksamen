import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../Sanity/sanityClient";
import '../styles/dashboard.scss'
import "../styles/header.scss"
import { fetchAllUsers, fetchUserById } from "../Sanity/sanityServices";


//Hämtar props från app.jsx
export default function Dashboard({ isLoggedIn, setIsLoggedIn }) {
    
    //Statevariabel för innlogningsuppgifter
    const [userLogin, setUserLogin] = useState({});
    //Statevariabel för alla brukere från sanity
    const [allUsers, setAllUsers] = useState([]);
    ////Statevariabel för inloggad bruker
    const [currentUser, setCurrentUser] = useState(null);
    ////Statevariabel för felmeddelande vid inloggning
    const [error, setError] = useState("");
    ////Statevariabel för events i önskelisten
    const [wishListEvents, setWishListEvents] = useState([]);
    //Statevariabel för tidigare kjöpte events
    const [previousPurchaseEvents, setPreviousPurchaseEvents] = useState([]);
    //Statevariabel för events som är delade med vänner
    const [sharedFriendsEvent, setSharedFriendsEvent] = useState({});

    const apiKey = '4P5afjX98PHm5yhdSLbee6G9PVKAQGB7'; //api nyckel

   //Async funktion för att hämta alla brukere från sanity
    const getUsers = async () => {
        try {
            //Hämtar data 
            const data = await fetchAllUsers(client);
            setAllUsers(data);

        //Catch för att fånga fel och få meddelande i konsollen
        } catch (error) {
            console.error("Skjedde noe feil ved fetch av brukene", error);
        }
    };

    //Körs första gången komponenten renderas
    useEffect(() => {
        getUsers();
    }, []);

    //Asynkron funktion som hämtar användare från localStorage och laddar datan
    const getCurrentUser = async () => {
        //Hämtar innlogningsstatus
        const storedLogin = localStorage.getItem("login");
        //Hämtar de sparade userIds:en
        const storedUserId = localStorage.getItem("userId");
        //Om brukeren inte är inloggad eller saknar ett id avbryts funktionen
        if (storedLogin !== "true" || !storedUserId) return;

        //Anropar funktionen som hämtar brukeren från sanity
        try {
            const user = await fetchUserById(client, storedUserId);
            //Om brukaren hittas sätts den i state variabel currentUser
            if (user) {
                setCurrentUser(user);
                //Hämtar brukarens eventdata
                await fetchEventDetails(user);
            }

        //Catch för att hitta fel och visa detta i konsollen
        } catch (error) {
            console.error("Skjedde noe feil ved henting av bruker", error);
        }
    };

    //Körs första gången komponenten renderas
    useEffect(() => {
        getCurrentUser();
    }, []);

    //Funktion som hämtar enskilt event från api baserat på apiId
    const fetchSingleEvent = async (apiId) => {
        //Om inget apiId finns så avbryts funktionen
        if (!apiId) return null;
            
        //Gör ett anrop och omvandlar till json format. sen hämtar relevant info som name, date osv
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
           
        //Hittar fel och visar det i konsollen
        } catch (error) {
            console.error("Skjedde noe feil ved henting av event", error);
            return null;
        }
    };

    //Funktion som hämtar detaljinfo om en brukeres event
    const fetchEventDetails = async (user) => {
        //Tar ut apiId från brukarens önskeliste och tidigere kjöp
        const sanityWishlistIds = user.wishList?.map(item => item.apiId) || [];
        const purchaseIds = user.previousPurchases?.map(item => item.apiId) || [];
        
        //Hämta data om varje event i önskelisten
        const sanityWishlist = [];
        //En for loop för att gå igenom varje element i arrayen. För varje id anropar den fetchSingleEvent
        for (let id of sanityWishlistIds) {
            const event = await fetchSingleEvent(id);
            //Kontrollerar om det kom ett eventobjekt tillbaka. om inte blir det undefiend
            if (event) {
                sanityWishlist.push(event);
            }
        }

        //Hämta data om varje event i tidigere kjöp
        const purchaseResult = [];
        for (let id of purchaseIds) {
            const event = await fetchSingleEvent(id);
            if (event) {
                purchaseResult.push(event)
            }
        }
        //Uppdatera state-variablerna med resultaten
        setWishListEvents(sanityWishlist);
        setPreviousPurchaseEvents(purchaseResult);

        //Se om det finns gemensamma events med vänner
        const sharedEvents = {};
        for (let friend of user.friends || []) {
            //Filtrerar ut events som brukaren och vänen har gemensamt
            const sharedEvent = sanityWishlist.filter(event =>
                friend.wishList?.some(friendEvent => friendEvent.apiId === event.id)
            );
            if (sharedEvent.length > 0) {
                //Om gemensamma events existerar, sparas de under vännens id
                sharedEvents[friend._id] = sharedEvent;
            }
        }
        //Uppdaterar state-variabeln med gemensamma events
        setSharedFriendsEvent(sharedEvents);
    }

    //Funktion som hanterar input infon
    const handleChange = (e) => {
        //Hämtar namnet på inputfältet och värdet
        const { name, value } = e.target;
        //Uppdaterar userLogin staten
        setUserLogin((prev) => ({...prev, [name]: value}));
    };

    //Funktion som körs när brukaren loggar in
    const handleClick = (e) => {
        //Förhindrar att formuläret skickas via browsern
        e.preventDefault();
        //Hittar brukare baserat på brukernavn
        const matchedUser = allUsers.find(
            (user) => user.username === userLogin.username
        );

        //Om brukaren finns:
        if (matchedUser) {
            //Sätt innloggningsstatus till inloggad(true)
            setIsLoggedIn(true);
            //Spara brukaren i staten
            setCurrentUser(matchedUser);
            //Spara inloggningsstatus i localStorage
            localStorage.setItem("login", "true");
            //Spara brukarens id i localStorage
            localStorage.setItem("userId", matchedUser._id);
            //Hämta alla brukarens events
            fetchEventDetails(matchedUser);
            //Rensa evt felmeddelande
            setError("");
        //Om brukaren inte finns, retunera detta felmeddelande
        } else {
            setError("Finner inget konto koblet til dette brukernavn");
        }
    };

    //Funktion som körs när brukeren loggar ut. Ändrar inloggnongsstatus, rensar ösnkelisten osv
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
            {/*Om brukaren inte är inloggade visas denna sektion*/}
            {!isLoggedIn ? (
                <section className="login-section" aria-label="Innloggingsseksjon">
                    <h2>Logg inn</h2>
                    <form className="login-form" aria-label="Innloggingsskjema">
                        <label className="login-label">
                            Brukernavn
                            <input 
                            type="text"
                            name="username"
                            placeholder="erlingHaaland123"
                            onChange={handleChange}
                            className="login-input"
                            aria-required="true"
                            />
                        </label>

                        <button className="login-button" onClick={handleClick}>Logg inn</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </section>
            ) : (
            //Om brukeren är inloggad visas istället denna del
                <>
                    {/*Sektion för brukerprofilen*/}
                    <section className="user-dashboard" aria-labelledby="user-dashboard-heading" role="region">
                        <article className="user-profile" aria-label="Brukerprofil">
                            <h1 id="user-dahboard-heading">Min side</h1>
                            <h2 className="user-name">{currentUser?.name}</h2>
                            {currentUser?.image?.asset?.url && <img className="user-image" src={currentUser?.image?.asset?.url} alt={`Profilbilde av ${currentUser?.name}`} />}
                            <p className="user-email">Email: {currentUser?.email}</p>
                            <p className="user-age">Alder: {currentUser?.age} år</p>
                            <button className="logout-button" onClick={handleLogout}>Logg ut</button>
                        </article>
                    </section>

                    {/*Sektion för vänner*/}
                    <section aria-labelledby="friends-heading" role="region">
                        <article className="friends">
                            <h2>Mine venner</h2>
                            <ul>
                                {/*Loopar genom alla vänner*/}
                                {currentUser?.friends?.map(friend => (
                                    <li key={friend._id} aria-label={`Venn: ${friend.name}`}>
                                        {friend.image?.asset?.url && (
                                            <img src={friend.image.asset.url} alt={`Bilde av ${friend.name}`} />
                                        )}
                                        <p>{friend.name}</p>
                                        {/*Loopar genom events för att hitta gemensamma*/}
                                        {sharedFriendsEvent[friend._id]?.map(event => (
                                            <p key={event.id}>Du og {friend.name} har samme event i ønskelisten. Hva med å dra sammen på <strong>{event.name}</strong>?</p>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    {/*Sektion för tidigere kjöp och önskeliste*/}
                    <section aria-labelledby="purchases-and-wishlist-heading" role="region">
                        <article className="user-purchases" aria-label="Tidligere kjøp">
                            <h2>Mine kjøp</h2>
                            <ul>
                                {/*Loopar genom och visar tidigare kjöpte events*/}
                                {previousPurchaseEvents.map(event => (
                                    <li key={event.id} aria-label={`Tidligere kjøp: ${event.name}`}>
                                        <img src={event.image} alt={`Bilde av ${event.name}`} />
                                        <h3>{event.name}</h3>
                                        <p>{event.date}</p>
                                        <Link to={`/sanity-event/${event.id}`} aria-label={`Se mer informasjon om ${event.name}`}>Se mer om dette kjøpet</Link>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="user-wishlist" aria-label="Ønskeliste">
                            <h2>Min ønskeliste</h2>
                            <ul>
                                {/*Loopar genom och visar alla events i önskelistan*/}
                                {wishListEvents.map(event => (
                                    <li key={event.id} aria-label={event.name}>
                                        <img src={event.image} alt={`Bilde av ${event.name}`} />
                                        <h3>{event.name}</h3>
                                        <p>{event.date}</p>
                                        <Link to={`/sanity-event/${event.id}`} aria-label={`Se mer informasjon om ${event.name}`}>Se mer om dette kjøpet</Link>
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
