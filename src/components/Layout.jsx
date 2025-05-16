import Header from "./Header";
import Footer from "./footer";
import '../styles/header.scss'



export default function Layout({ children }) {
  return (
    <>
      <Header />

      <main>
        {children}
      </main>

      <Footer/>
    </>
  );
}