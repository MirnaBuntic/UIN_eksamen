import { useState } from "react";

export default function Dashboard() {
    
    const [userLogin, setUserLogin] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLogin((prev) => ({...prev, [name]: value}));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
    };

    return (
       <div>
            {!isLoggedIn ? (
                <section>
                    <h>Logg inn</h>
                    <form>
                        <label>
                            Brukernavn
                            <input 
                            type="text"
                            name="username"
                            placeholder="Ola Nordmann"
                            onChange={handleChange}
                            />
                        </label>
                        <label>
                            Passord
                            <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleLogin}>Logg inn</button>
                    </form>
                </section>
            ) : ( 
                <section>
                    <h1>Min side</h1>
                    <p>Du er nå logget inn som {userLogin.username}</p>
                </section>
            )}
       </div>
    );
    
}