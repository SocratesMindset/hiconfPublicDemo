import "../css/About.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Nav />
      <div className="aboutPage">
        <h2 className="aboutTitle">О нас</h2>
        <div className="noPage">
          <h1>Страница в разработке...</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
