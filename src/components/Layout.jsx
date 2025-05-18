import Header from "./Header";
import Footer from "./Footer"
import '../styles/header.scss'

//Definerer og eksporterer et komponent som wrapper rundt alt av page content og er likt på alle sider
//Children er alle komponentene som er i er sidens innhold
//isLogged in er en boolean som passeres som en prop som indikerer om brukeren er logget inn eller inn, den er passert ned til header
//Layouten inneholder de tre tingene som skal være likt på alle sider. Alle sider skal ha 
//en header, en main seksjon (men med ulikt innhold) og en footer. 
export default function Layout({ children, isLoggedIn }) {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      <main>
        {children}
      </main>

      <Footer/>
    </>
  );
}