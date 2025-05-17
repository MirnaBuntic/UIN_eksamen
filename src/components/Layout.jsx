import Header from "./Header";
import Footer from "./Footer"
import '../styles/header.scss'


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