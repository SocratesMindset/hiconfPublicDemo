import "../css/Contacts.css";
import Nav from "../components/Nav.js";
import Footer from "../components/Footer.js";

function Contacts() {
  return (
    <>
      <Nav />
      <div className="contactsPage">
        <h2 className="contactsTitle">Контакты</h2>
        <div className="noPage">
          <h1>Страница в разработке...</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contacts;
