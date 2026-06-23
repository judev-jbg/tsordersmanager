import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useToast from "../hooks/useToast";
import ToastNotifier from "./ToastNotifier";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthContext();
  const { toast, showToast } = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!credentials.username || !credentials.password) {
      showToast("Por favor, completa todos los campos", "error");
      return;
    }

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        showToast("Inicio de sesion exitoso", "success");
        // Delay para asegurar que el estado se actualiza
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 200);
      } else {
        // Mostrar error y limpiar solo el campo de password
        showToast(result.error || "Credenciales invalidas", "error");
        setCredentials({
          ...credentials,
          password: "", // Limpiar solo password
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      showToast("Error de conexion con el servidor", "error");
      setCredentials({
        ...credentials,
        password: "",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>TS Orders Manager</h1>
          <p>Inicia sesion para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contrasena</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingresa tu contrasena"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "INICIANDO SESION..." : "INICIAR SESION"}
          </button>
        </form>
      </div>

      {toast.visible && (
        <ToastNotifier message={toast.message} type={toast.type} />
      )}
    </div>
  );
};

export default Login;
