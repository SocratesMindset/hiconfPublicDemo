import { useState } from "react"
import "../css/Reviewer.css";
import axios from "axios";

function ReviewerOneConf(props: any) {

    const [comment, setComment] = useState<string>();

    console.log ( props.list, props.helper )
    const confirmComent = async (comment: string | undefined, id_conference: number | undefined, id_participant: number | undefined ) => {
    const response = await axios.post("/api/confirmcomment", {
      comment,
      id_conference,
      id_participant
    });
    return response.data;
  }
  
  const downloadFile = async ( id_conference: number | undefined, id_participant: number | undefined ) => {
    axios ({
	url: `/api/articleRewiever?conf=${id_conference}&part=${id_participant}`,
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


  return (
    <>
     <div className='reviewercontainer'>
        
          <div className='revieweroneConf'>
            <div className='reviewerconfItem'><p>{props.list.name}</p></div>
            <div className='reviewerconfItem'><p>{props.list.email}</p></div>
            <div className='reviewerconfItem'><button className='reviewerbtn' onClick={() => downloadFile(props.helper.id_conference, props.list.id_participant)}><p>{props.list.article}</p></button></div>
          </div>

          <textarea value={comment} onChange={e => setComment(e.target.value)} className='reviewercomment'
            placeholder='Комментарий'>
          </textarea>
        
        <button onClick={() => confirmComent(comment, props.helper.id_conference, props.list.id_participant)}
           
          className='reviewerbtn' type='submit'>Подтвердить</button>
</div>
      </>
  )
}

export default ReviewerOneConf
