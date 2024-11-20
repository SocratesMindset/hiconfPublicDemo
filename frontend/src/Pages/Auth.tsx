import { useState } from "react";
import Reg from "../components/Reg";
import Login from "../components/Login";

function Auth() {
  // Условный рендринг формы регистрации
  const [regMode, setRegMode] = useState(false);
  const handlerClick = () => {
    setRegMode(!regMode);
  };

  function handleReg() {
    setRegMode(false);
  }

  return (
    <div>
      {regMode ? (
        <Reg
          handleReg={handleReg}
          b={
            <button onClick={handlerClick} className="register-link">
              Войти в акаунт.
            </button>
          }
        />
      ) : (
        <Login
          b={
            <button onClick={handlerClick} className="register-link">
              Создать учетную запись.
            </button>
          }
        />
      )}
    </div>
  );
}

export default Auth;
