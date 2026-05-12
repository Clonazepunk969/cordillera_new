import { useState } from "react";
import { register } from "../service/authService";
import "./auth.css";

export default function Register({ onRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ANALISTA");
    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await register({ username, password, role });

            const textoRespuesta =
                response?.message ||
                response?.mensaje ||
                "Usuario registrado correctamente";

            setMensaje(textoRespuesta);
            setTipoMensaje("success");

            setUsername("");
            setPassword("");
            setRole("ANALISTA");

            setTimeout(() => {
                onRegister();
            }, 1000);

        } catch (error) {
            console.error("Error register:", error);
            console.error("Respuesta backend:", error.response);

            const textoError =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                error.response?.data?.error ||
                "Error al registrar usuario";

            setMensaje(textoError);
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
                <h2 className="auth-title">Crear cuenta</h2>
                <p className="auth-subtitle">
                    Registra un usuario para acceder a la plataforma.
                </p>

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="auth-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Crea tu usuario"
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Crea tu contraseña"
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Rol</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="ANALISTA">Analista</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-primary-btn">
                        Registrar
                    </button>
                </form>

                <button onClick={onRegister} className="auth-secondary-btn">
                    Volver al login
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