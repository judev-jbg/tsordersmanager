import { createContext, useContext, useState, useEffect, useRef } from "react";
import authService from "../services/authService";

/**
 * Contexto de autenticación global
 * Proporciona estado de autenticación a toda la aplicación
 */
const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const isInitialMount = useRef(true);

  // Verificar autenticación solo en el primer montaje
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const result = await authService.checkAuth();
      setAuthenticated(result.authenticated);
      if (result.authenticated) {
        setUser({ username: result.username });
      } else {
        setUser(null);
      }
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        // Actualizar estado inmediatamente
        setAuthenticated(true);
        setUser({ username: result.data.username });
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      return { success: false, error: "Error inesperado" };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Error al cerrar sesión" };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
