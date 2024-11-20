
import { useState } from 'react';
import "../css/Admin.css";
import axios from "axios";




function AdminOneConf(props: any) {

    const [select, setSelect] = useState<string>();

    console.log(props.list, props.helper)
  const confirmRole = async (select: string | undefined, id_conference: number | undefined, id_user: number | undefined ) => {
    const response = await axios.post("/api/confirmrole", {
      select,
      id_conference,
      id_user
    });
    return response.data;
  }

  return (
    <>
      <div className='adminoneConf'>
          <div className='adminconfItem'><p>{props.list.name}</p></div>
          <div className='adminconfItem'><p>{props.list.email}</p></div>
          <div className='adminconfItem'><p>{props.list.article}</p></div>
          <form className='adminconfItem'>
            <select value={select} onChange={e => setSelect(e.target.value)} name="" id="role" size={1}>
              <option>{props.list.role}</option>
              <option>participant</option>
              <option>reviewer</option>
            </select>
          </form>
           <button onClick={() => confirmRole(select, props.helper.id_conference, props.list.id_user)} className='adminbtn' type='submit'>Подтвердить</button>
       </div>
     </>   

  )
}

export default AdminOneConf
