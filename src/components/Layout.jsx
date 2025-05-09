import Header from "./Header";
import '../styles/header.scss'


export default function Layout({ children }) {
  return (
    <>
      <Header />

      <main>
        {children}
      </main>
    </>
  );
}