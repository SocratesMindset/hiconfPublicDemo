import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "../css/AddConf.css";
import { GoPencil } from "react-icons/go";
import { PiNewspaper } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AddConf() {

  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState("");
 


  const addConf = async (title: string, section: string, date: string) => {
    const response = await axios.post("/api/addconf", {
      title,
      section,
      date
    }, 
    
    );
    return response.data
  }





  return (
    <div id="addconf">
      <Nav />
      <div className="addConfPage">
        <h2 className="addConfTitle">Создать конференцию</h2>
        <section className="mainSection">
          <div className="confForm">
          <h4>Название</h4>
          <div className="confLine">
            <GoPencil size='65px' className="fcknicon" />
            <input
              // onBlur={(e) => blurHandler(e)}
              onChange={(e) => setTitle(e.target.value)}
              type="title"
              name="title"
              value={title}
            />
          </div>

          <h4>Секция</h4>
          <div className="confLine">
            <PiNewspaper size='65px' className="fcknicon" />
            <input
              // onBlur={(e) => blurHandler(e)}
              onChange={(e) => setSection(e.target.value)}

              type="title"
              name="section"
              value={section}
            />
          </div>

          <h4>Дата</h4>
          <div className="confLine">
            <CiCalendarDate size='65px' className="fcknicon" />
            <input
              // onBlur={(e) => blurHandler(e)}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              name="date"
              value={date}
            />
          </div>

          <button
            onClick={() => addConf(title, section, date)}
            className="addConfBtn"
          >
            Создать
          </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default AddConf;
