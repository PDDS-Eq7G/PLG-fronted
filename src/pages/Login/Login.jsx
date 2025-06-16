import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../../assets/fondo.jpeg";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica (puedes mejorarla)
    if (email === "admin@plg.com.pe" && password === "123456") {
      navigate("/dashboard"); // Redirección a la pantalla de bienvenida
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="login-background"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <div className="login-card">
        <h1 className="login-title">P L G</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">
            Usuario
          </label>
          <input
            type="email"
            id="email"
            className="login-input"
            // placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="login-input"
            // placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
