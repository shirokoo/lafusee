import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login_form() {
  //Variable which contain form data
  const [LoginformData, LoginsetFormData] = useState({
    email: "",
  });

  let [ValidEMail, setValidEMail] = useState(false);
  let [ValidRequest, setValidRequest] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  //Variable to use navigate function
  const navigate = useNavigate();
  async function Login() {
    if (!validateEmail(LoginformData.email)) {
      setValidEMail(true);
      setValidRequest(false); //Request error message hide
      return 0;
    }
    //Post request
    await axios
      .post("http://localhost:9000/api/login", {
        email: LoginformData.email,
      })
      .then(function (response) {
        if (response.status === 200) {
          //Store token in localStorage
          localStorage.setItem("token", response.data.token);
          //navigate to home
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        setValidEMail(false);
        setValidRequest(true); //Request error message show
      });
  }

  return (
    <div className="login-container">
      {/* Login form */}
      <form id="logForm" action="" className="form-login">
        <ul className="login-nav">
          <li className="login-nav__item active">
            <a href="/login">Connexion</a>
          </li>
          <li className="login-nav__item">
            <a href="/register">Inscription</a>
          </li>
          <p
            className="validation"
            style={{
              display: !ValidEMail ? "none" : "block",
            }}
          >
            Le format du mail est inccorecte
          </p>
          <p
            className="validation"
            style={{
              display: !ValidRequest ? "none" : "block",
            }}
          >
            Email ou mot de passe incorrecte
          </p>
        </ul>
        <label className="login__label">Email*</label>
        <input
          id="login-input-user"
          className="login__input"
          placeholder="Écrivez votre email"
          value={LoginformData.email}
          onChange={(e) => {
            LoginsetFormData({ ...LoginformData, email: e.target.value });
          }}
        />
        <div className="login-navigation">
          <button
            className="login__submit"
            type="button"
            onClick={() => {
              Login();
            }}
          >
            Connexion
          </button>
        </div>
        <div className="login__already">
          <p>Pas encore inscrit ?</p>
          <a href="/register">Inscrivez-vous !</a>
        </div>
      </form>
    </div>
  );
}

export default Login_form;
