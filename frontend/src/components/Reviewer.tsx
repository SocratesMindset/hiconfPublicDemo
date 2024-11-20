import Nav from './Nav'
import Footer from './Footer'
import "../css/Reviewer.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Conf } from '../Pages/RolePage';
import ReviewerOneConf from './ReviewerOneConf';


type RviewerResponse = {
  Reviewer: {
    id_participant: number,
    name: string,
    email: string,
    article: string,
  }[]
}


function Reviewer({conf}:{conf: Conf}) {
  

  const fetchInfo = async () => {
    const { data } = await axios.get<RviewerResponse>('/api/reviewer', 
    {	params: {
      		id_conference: conf.id_conference
	}
    })
    return data.Reviewer
  }
  const { data } = useQuery({ queryKey: ['info'], queryFn: fetchInfo })

  

  if (!data) {
    return (<div>
      <Nav />
      <div className="reviewerPage">
        <h2 className="reviewerTitle">Вы не состоите в конференции</h2>
        
      </div>
      <Footer />
    </div>)
}

  return (
    <div id='reviewer'>
      <Nav />
      <div className="reviewerPage">
        <div className="reviewerTitle">
          <h2>Рецензент</h2>
          <h2>{conf.title}</h2>
          <div></div>
        </div>
        <div className='reviewermainSection'></div>
        {data.map(users => (
        
        <ReviewerOneConf 
        list={users}
        helper={conf}
        />
        
        ))}
        

      </div>
      <Footer />
    </div>
  )
}

export default Reviewer
