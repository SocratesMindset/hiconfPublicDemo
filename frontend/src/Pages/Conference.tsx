import "../css/Conference.css";
import Footer from "../components/Footer.js";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav.js";
import { useAtomValue } from "jotai";
import { authAtom } from "../actions/atom.js";

function Conference() {
  const auth = useAtomValue(authAtom);
  const navigate = useNavigate();
  console.log(auth);
  if (!auth) {
    navigate("/enter");
  }

  return (
    <>
      <Nav />
      <div className="conferencePage">
        <h2 className="conferenceTitle">Конференции</h2>
        <div className="choiceConf">
          <div className="containC">
            <Link to="/addconf">
              <button className="choiceConf createConf">
                <h2>Создать Конференцию</h2>
              </button>
            </Link>
          </div>
          <div className="containC">
            <Link to="/myconf">
              <button className="choiceConf myConf">
                <h2>Мои конференции</h2>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Conference;
