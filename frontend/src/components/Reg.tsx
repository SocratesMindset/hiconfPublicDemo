import { useEffect } from "react";
import "../css/Auth.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthParams, registration } from "../actions/user";

function Reg(props: { b: JSX.Element, handleReg: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailDirty, setEmailDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [emailError, setEmailError] = useState("Email не может быть пустым");
  const [passwordError, setPasswordError] = useState(
    "Пароль не может быть пустым"
  );
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (emailError || passwordError) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  });

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

    if (e.target.value.length < 4 || e.target.value.length > 30) {
      setPasswordError("Пароль не должен быть меньше 4 и длиннее 30");
      if (!e.target.value) {
        setPasswordError("Пароль не может быть пустым");
      }
    } else {
      setPasswordError("");
    }
  };



  const { mutate: regUser, } = useMutation(
    {
      mutationFn: (userData: AuthParams) => registration(userData),

      onSuccess: () => {
        console.log("registered");
        props.handleReg();
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
    <div className="auth">
      <section className="authContent">
        <div className="bdform">
          <div className="autMainText">
            <h2 className="formTitle">Зарегистрироваться</h2>
            <p className="formSubtitle">
              Уже есть аккаунт? <span>{props.b}</span>
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

          <button
            disabled={!formValid}
            onClick={() => regUser({ email, password })}
            className="authButton"
          >
            Продолжить
          </button>
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

export default Reg;
