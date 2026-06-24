import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "../context/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticaci贸n
 * Redirige al login si el usuario no est谩 autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuthContext();

  // Mostrar loading mientras se verifica autenticaci贸n
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Verificando autenticación...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
