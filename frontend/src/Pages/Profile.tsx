import Nav from '../components/Nav'
import Footer from '../components/Footer'
import "../css/Profile.css";
import { BsPersonBoundingBox } from "react-icons/bs";
import { logout } from '../actions/user';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

function Profile() {

  const { mutate: logoutUser } = useMutation(
    {
      mutationFn: () => logout(),

      onSuccess: () => {
        console.log("login");
        // store.setRequestLoading(false);
        // toast.success("You successfully logged in");
        // navigate(from);
      },
      onError: (error) => {
        // store.setRequestLoading(false);
        console.error(error);
      },
    }
  );

  const fetchProfile = async () => {
    const { data } = await axios.get('/api/profile')
    return data.profile
  }

  const { data, isLoading, isError, error } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile })


  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>{`Error: ${JSON.stringify(error)}`}</p>
  }

  return (
    <div id='/profile'>
      <Nav />
      <div className="profiePage">
        <h2 className="profileTitle">Мой профиль</h2>
        <section className="mainSection">
          <BsPersonBoundingBox className='icon' />
          <form className="profileForm">

            <div className="confLine">
              <h4>{data.email}</h4>
            </div>

            <div className="confLine">
              <h4>{data.fullname}</h4>
            </div>

            <div className="confLine">
              <h4>{data.age}</h4>
            </div>

            <div className="confLine">
              <h4>{data.company}</h4>
            </div>


            <button onClick={() => logoutUser()} className='btn'>Выйти</button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Profile
