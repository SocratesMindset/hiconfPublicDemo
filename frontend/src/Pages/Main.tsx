import "../css/Main.css";
import Nav from "../components/Nav.js";
import Footer from "../components/Footer.js";
// import { useSetAtom } from "jotai";
// import { authAtom } from "../actions/atom";

function Main() {
  // const setAuth = useSetAtom(authAtom);

  // const handleAuth = (value) => {
  //   setAuth(value);
  //   localStorage.setItem("auth", value);
  // }

  return (
    <>
      <Nav />
      <div className="mainPage">
        <div>
          <h2 className="mainTitle">HiConf</h2>
          {/* <button onClick={() => handleAuth(true)}>auth true</button>
          <button onClick={() => handleAuth(false)}>auth false</button> */}
          <div className="noPage">
            <h1>Страница в разработке...</h1>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Main;
