export default function Dashboard() {
    return (
        <div>
            <h1>Logg inn</h1>
            <form>
                <label htmlFor="username">Brukernavn</label>
                <input type="text" id="username" placeholder="Kari Nordmann" />

                <label htmlFor="password">Passord:</label>
                <input type="password" id="password" />

                <button type="submit">Logg inn</button>
            </form>
        </div>
    );
}