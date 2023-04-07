import { useState } from "react";
import http from "../../../httpService";
import { useNavigate } from "react-router-dom";

function Login_form() {
  //Variable which contain form data
  const [formData, setFormData] = useState({
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
  function Register() {
    if (!validateEmail(formData.email)) {
      setValidEMail(true);
      setValidRequest(false); //Request error message hide
      return 0;
    }
    //Post request
    http
      .post("http://localhost:9000/api/register", {
        email: formData.email,
      })
      .then(function (response) {
        if (response.status === 200) {
          //navigate to home
          navigate("/login");
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
      {/* Register form */}
      <form id="logForm" action="" className="form-login">
        <ul className="login-nav">
          <li className="login-nav__item active">
            <a href="/register">Inscription</a>
          </li>
          <li className="login-nav__item">
            <a href="/login">Connexion</a>
          </li>
          <p
            className="validation"
            style={{ display: !ValidEMail ? "none" : "block" }}
          >
            Le format du mail est inccorecte
          </p>
          <p
            className="validation"
            style={{
              display: !ValidRequest ? "none" : "block",
            }}
          >
            Erreur lors de la création du compte
          </p>
        </ul>
        <label className="login__label">Email*</label>
        <input
          id="login-input-user"
          className="login__input"
          placeholder="Écrivez votre email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
        />
        <div className="login-navigation">
          <button
            className="login__submit"
            type="button"
            onClick={() => {
              Register();
            }}
          >
            Connexion
          </button>
        </div>
        <div className="login__already">
          <p>Déjà inscrit ?</p>
          <a href="/login">Connectez-vous !</a>
        </div>
      </form>
    </div>
  );
}

export default Login_form;
