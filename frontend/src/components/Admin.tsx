import "../css/Admin.css";
import Nav from './Nav';
import Footer from './Footer';
import { useState } from 'react';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Conf } from "../Pages/RolePage";
import AdminOneConf from "./AdminOneConf";

export type AdminResponse = {
  Participants: {
    id_user: number,
    id_role: number,
    name: string,
    role: string,
    email: string,
    article: string
  }[]
}

function Admin({conf}:{conf: Conf}) {



  const fetchInfo = async () => {
    const { data } = await axios.get<AdminResponse>('/api/admin', 
    {
    	params: {
	      id_conference: conf.id_conference
	}
    })
    return data.Participants
  }
  const { data } = useQuery({ queryKey: ['info'], queryFn: fetchInfo })


  if (!data) {
      return (<div>
        <Nav />
        <div className="adminPage">
          <h2 className="adminTitle">На вашу конференцию никто не зарегистрировался</h2>
          
        </div>
        <Footer />
      </div>)
  }

  return (
    <div id='admin'>
      <Nav />
      <div className="adminPage">
        <div className="adminTitle">
          <h2>Администратор</h2>
          <h2>{conf.title}</h2>
          <div></div>
        </div>
        <div className='adminmainSection'></div>
        <div className='admincontainer'>
        {data.map(users => (
           
           <AdminOneConf 
           list={users}
           helper={conf}
           />

           ))}
          
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Admin
