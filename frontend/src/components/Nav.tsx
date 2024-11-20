import { Link } from "react-router-dom";
import "../css/Nav.css";
import { useAtomValue } from "jotai";
import { authAtom } from "../actions/atom";
import { LogoutBtn } from "./LogoutBtn";

function Nav() {
  const auth = useAtomValue(authAtom);

  return (
    <div className="navbar">
      <nav className="navList">
        <Link to="/">
          <li>
            <a className="logoTitle">HiConf</a>
          </li>
        </Link>

        <Link to="/about">
          <li>
            <a>О нас</a>
          </li>
        </Link>

        <Link to="/contact">
          <li>
            <a>Контакты</a>
          </li>
        </Link>

        <Link to="/conference">
          <li>
            <a>Конференции</a>
          </li>
        </Link>

      </nav>
      {
        auth ?
          // <Link to="/profile">
          //   <li>
          //     <a>Профиль</a>
          //   </li>
          // </Link>
          <LogoutBtn />
          :
          <div className="navEnter">
            <Link to="/enter">
              <li>
                <a>Вход</a>
              </li>
            </Link>
          </div>



      }

    </div>
  );
}

export default Nav;
