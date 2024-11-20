import "../css/JoinConf.css";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAtomValue } from "jotai";
import { authAtom } from "../actions/atom.js";
import { useState } from "react";
import axios from "axios";
import { Conf } from "./RolePage.js";
import { useSearchParams } from 'react-router-dom';

function JoinConf() { 

    const searchParams = new 
    URLSearchParams ( window.location.search );

    const confID = searchParams.get('id');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    

    const auth = useAtomValue(authAtom);
    const navigate = useNavigate();
    console.log(auth);
    if (!auth) {
      navigate("/enter");
    }

    

      

      const joinConf = async (name: string, email: string, id_conference: number) => {
        const response = await axios.post(`/api/joinconf/${id_conference}`, {
            name,
            email,
            id_conference
        });
        return response.data;
      }



  return (
    <div id="joinconf">
        <Nav />
    <div className="joinConfPage">
      <h2 className="joinConfTitle">Зарегистрироваться на конференцию</h2>
      <section className="mainSection">
          <div className="confForm">
          <h4>ФИО</h4>
          <div className="confLine">
            <input
              // onBlur={(e) => blurHandler(e)}
              onChange={(e) => setName(e.target.value)}
              type="name"
              name="name"
              value={name}
            />
          </div>

          <h4>Email</h4>
          <div className="confLine">
            <input
              // onBlur={(e) => blurHandler(e)}
              onChange={(e) => setEmail(e.target.value)}

              type="email"
              name="email"
              value={email}
            />
          </div>

          <button
            onClick={() => joinConf(name, email, confID)}
            className="addConfBtn" >
            Зарегистрироваться
          </button>
          </div>
        </section>
    </div>
    <Footer />
    </div>
  )
}

export default JoinConf
