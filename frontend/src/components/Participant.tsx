import Nav from './Nav'
import Footer from './Footer'
import "../css/Participant.css";
import { useState } from 'react';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Conf } from '../Pages/RolePage';
import { GrDocumentDownload } from "react-icons/gr";
import { BsCloudDownload } from "react-icons/bs";

type ParticipantResponse = {
  info: {
    id_user: number,
    name: string,
    email: string,
    article: string,
    comment: string
  }[]
}

function Participant({conf}:{conf: Conf}) {

  const [selectedFile, setSelectedFile] = useState();

  const fetchPart = async () => {
    const { data } = await axios.get<ParticipantResponse>('/api/participant',
    {
	params: {
		id_conference: conf.id_conference
	}
    })
    return data.info
  }

  const { data, isLoading, isError, error } = useQuery({ queryKey: ['part-data'], queryFn: fetchPart })

  const confirmFile = async (id_conference: number | undefined ) => {
  if ( !selectedFile )
    { 
	alert("Please select a file");
	return;
    };
    const formData = new FormData();
    formData.append("file", selectedFile )
    //const response = await axios.post("/api/confirmfile", {
    //  id_conference,
    //  file: formData,
    //});
    //return response.data;
    const res = await fetch ( `/api/confirmFile/${id_conference}`, {
      method: 'POST',
      body: formData,
    });
    
  }

  function handleFile(event: any) {
    setSelectedFile ( event.target.files[0] )
  }

  if (!data) {
    return (<div>
      <Nav />
      <div className="participantPage">
        <h2 className="participantTitle">Вы не состоите в конференции</h2>
        
      </div>
      <Footer />
    </div>)
}

  return (
    <div id='participant'>
      <Nav />
      <div className="participantPage">
        <div className="participantTitle">
          <h2>Участник</h2>
          <h2>{conf.title}</h2>
          <div></div>
        </div>
        <div className='participantmainSection'></div>
       
        {data.map(user => (
        <div className='participantcontainer'>
          
          <div className='participantoneConf'>
            <div className='participantconfItem'><p>{user.name}</p></div>
            <div className='participantconfItem'><p>{user.email}</p></div>
            <div className='participantconfItem'><p>{user.article}</p></div>
          </div>
          <h3>комментарий:</h3>
          <div className='participantcomment'>

            <p>{user.comment}</p>
          </div>
           <label>
            <input className='file' type='file' name='file' onChange={(e) => handleFile(e)} accept=".pdf,.docx"/>
            <span>добавить файл</span>
            <BsCloudDownload  size={30}/></label>

          <button onClick={() => confirmFile(conf.id_conference)} className='participantbtn' type='submit'>Отправить</button>
        </div>
       ))}

      </div>
      <Footer />
    </div>
  )
}

export default Participant
