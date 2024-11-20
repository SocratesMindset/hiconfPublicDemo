import "./css/App.css";

import { Route, Routes } from "react-router-dom";

import About from "./Pages/About";
import Auth from "./Pages/Auth";
import ConfList from "./Pages/ConfList";
import ConfForm from "./Pages/ConfForm";
import Conference from "./Pages/Conference";
import Contacts from "./Pages/Contacts";
import Main from "./Pages/Main";
import Profile from "./Pages/Profile";
import { useAtomValue } from "jotai";
import { authAtom } from "./actions/atom";
import RolePage from "./Pages/RolePage";
import JoinConf from "./Pages/JoinConf";

const App = () => {
  const auth = useAtomValue(authAtom);


  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/about" element={<About />} />

        <Route element={<Profile />} path="/profile" />
        <Route element={<Conference />} path="/conference" />
        <Route element={<ConfForm />} path="/addconf" />
        <Route element={<ConfList />} path="/myconf" />
        <Route element={<Auth />} path="/enter" />
        <Route element={<JoinConf />} path="/joinconf" />

        <Route path="/enter" element={<Auth />} />
        <Route path="*" element={<div>404... not found </div>} />
      </Routes>
    </>
  );
};

export default App;
