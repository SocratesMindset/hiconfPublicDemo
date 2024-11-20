import "../css/Auth.css";
import { useState } from "react";
//import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthParams, login, logout } from "../actions/user";
import { useMutation } from "@tanstack/react-query";
import { authAtom } from "../actions/atom";
import { useAtom } from "jotai";

function Enter(props: { b: JSX.Element }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailDirty, setEmailDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [emailError, setEmailError] = useState("Email не может быть пустым");
  const [passwordError, setPasswordError] = useState(
    "Пароль не может быть пустым"
  );

  const [auth, setAuth] = useAtom(authAtom);

  const navigate = useNavigate();

  console.log("auth", auth)

  // const [posts, setPosts] = useState([]);

  const blurHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    switch (e.target.name) {
      case "email":
        setEmailDirty(true);
        break;
      case "password":
        setPasswordDirty(true);
        break;
    }
  };

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setEmailError("Некорректный email");
    } else {
      setEmailError("");
    }
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };


  const { mutate: logUser, } = useMutation(
    {
      mutationFn: (userData: AuthParams) => login(userData),

      onSuccess: () => {
        console.log("login");
        setAuth(true);
        localStorage.setItem("auth", "true");
        navigate("/addconf");
        // <Navigate to='/addconf'/>
        // store.setRequestLoading(false);
        // toast.success("You successfully logged in");
        // navigate(from);
      },
      onError: (error) => {
        setAuth(false);
        localStorage.setItem("auth", "false");
        // store.setRequestLoading(false);
        console.error(error);
      },
    }
  );

  const { mutate: logoutUser, } = useMutation(
    {
      mutationFn: () => logout(),

      onSuccess: () => {
        setAuth(false);
        console.log("login");
        localStorage.setItem("auth", "false");
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

  return (
    <div id="/login" className="auth">
      <section className="authContent">
        <div className="bdform">
          <div className="autMainText">
            <h2 className="formTitle">Войти</h2>
            <p className="formSubtitle">
              Новый пользователь? <span>{props.b}</span>
            </p>
          </div>
          <div className="input-box">
            {emailDirty && emailError && (
              <div style={{ color: "red", fontSize: "15px" }}>
                {emailError}
              </div>
            )}
            <input
              onBlur={(e) => blurHandler(e)}
              onChange={(e) => emailHandler(e)}
              type="email"
              name="email"
              value={email}
              placeholder="Адрес электронной почты"
              required
            />
          </div>
          <div className="input-box">
            {passwordDirty && passwordError && (
              <div style={{ color: "red", fontSize: "15px" }}>
                {passwordError}
              </div>
            )}
            <input
              onBlur={(e) => blurHandler(e)}
              onChange={(e) => passwordHandler(e)}
              type="password"
              name="password"
              value={password}
              placeholder="Пароль"
              required
            />
          </div>

          <button onClick={() => logUser({ email, password })} className="authButton">Продолжить</button>
          {
            auth ? <button onClick={() => logoutUser()} className="" >выйти</button> : null
          }
        </div>
        <div className="authText">
          <Link to="/">
            <h1>HiConf</h1>
          </Link>
          <p>Войдите или создайте учётную запись</p>
        </div>
      </section>
    </div>
  );
}

export default Enter;
