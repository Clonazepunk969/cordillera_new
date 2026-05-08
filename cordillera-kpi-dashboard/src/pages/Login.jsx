import { useState } from "react";
import { login } from "../service/authService";
import "./auth.css";

export default function Login({ onLogin, goRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username || username);
      localStorage.setItem("role", response.role || "ADMIN");

      setMensaje("Inicio de sesión exitoso");
      setTipoMensaje("success");

      onLogin();
    } catch (error) {
      console.error("Error login:", error);
      console.error("Respuesta backend:", error.response);
      setMensaje(error.response?.data?.error || "Error al iniciar sesión");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>Cordillera SPA</h1>
        <p>Monitoreo inteligente del desempeño organizacional</p>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Iniciar sesión</h2>
        <p className="auth-subtitle">
          Acceda a su panel de análisis y visualización empresarial.
        </p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="auth-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button type="submit" className="auth-primary-btn">
            Ingresar
          </button>
        </form>

        <button onClick={goRegister} className="auth-secondary-btn">
          Crear cuenta
        </button>

        {mensaje && (
          <div className={`auth-message ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}