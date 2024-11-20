import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "../css/ConfList.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { useState } from "react";
import RolePage, { Conf } from "./RolePage";

type ConfResponse = {
  list: {
    id_conference: number,
    id_role: number,
    title: string,
    section: string,
    role: string
  }[]
}

function ConfList() {

const [selectedConf, setConf] = useState<Conf>();
const [uploadFile, setUploadFile ] = useState();

  const fetchConf = async () => {
    const { data } = await axios.get<ConfResponse>('/api/conflist')
    return data.list
  }

  const { data, isLoading, isError, error } = useQuery({ queryKey: ['conf-data'], queryFn: fetchConf })

  const handleFile = async ( id_conference: number | undefined ) => {
    axios ({
	url: `/api/downloadfile/${id_conference}`,
	method: 'GET',
	responseType: 'blob',
    }).then((response) => {
    	const href = URL.createObjectURL(new Blob ([response.data]));

	const link = document.createElement('a');
	link.href = href;
	link.setAttribute ( 'download', 'file.pdf' );
	document.body.appendChild ( link );
	link.click();
	document.body.removeChild(link);

  });
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>{`Error: ${JSON.stringify(error)}`}</p>
  }
  if (selectedConf) {
  return <RolePage conf={selectedConf}/>
}

  if (!data) {
    return (
      <div className="noConf">
        <Nav />
        <p className="">Нет конференций:(</p>
        <Link to="/addconf"><button className="addConfBtn">Создать конференцию</button></Link>

        <Footer />
      </div>
    )
  }

  return (
    <div id="myconf">
      <Nav />
      <div className="myConfPage">
        <h2 className="myConfTitle">Мои конференции</h2>
        <section className="mainSection">
          <form className="confForm">
            {data.map(conf => (
              <div className="oneConf" key={conf.id_conference}>
                <TfiLayoutListThumb  size='65px' className="icon" />
                <div className="confText">
                  <h4 onClick={() => setConf(conf)}> {conf.title} </h4>
                  <p>
                    {conf.role}
                  </p>
                  </div>
                  <div className="btns">
                  {conf.role === "admin" && <Link to={`/joinconf?id=${conf.id_conference}`}><button className="btn">пригласить</button></Link>}
                  {conf.role === "participant" && <a><button onClick={() => this.handleFile(conf.id_conference)} className='btn'>Скачать</button></a>}
               
                </div>
          
              </div>
            ))}
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default ConfList;
