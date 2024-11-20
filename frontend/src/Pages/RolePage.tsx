import Nav from "../components/Nav";
import Footer from "../components/Footer";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Admin from '../components/Admin';
import Reviewer from '../components/Reviewer';
import Participant from '../components/Participant';

export type Conf = {
  id_conference: number,
  id_role: number,
  title: string,
  section: string,
  role: string
}

function RolePage({conf}:{conf: Conf}) {
  if (conf.role === "admin") {
    return <Admin conf={conf}/>
  }

  if (conf.role === "reviewer") {
    return <Reviewer conf={conf}/>
  }

  if (conf.role === "participant") {
    return <Participant  conf={conf}/>
  }

  return (
    <div id='rolePage'>
      <Nav />
      <div className="rolePage">
        <h2 className="roleTitle">У вас нет конференций</h2>
      </div>
      <Footer />
    </div>
  )
}
export default RolePage
