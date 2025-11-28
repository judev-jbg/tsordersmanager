import { useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

/**
 * Hook personalizado para manejar autenticaci贸n
 * Proporciona estado y funciones para login, logout y verificaci贸n
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Verificar estado de autenticaci贸n al cargar
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Verificar si el usuario est谩 autenticado
   */
  const checkAuthStatus = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Iniciar sesi贸n
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contrase帽a
   * @returns {Promise<Object>} - Resultado del login
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        setAuthenticated(true);
        setUser({ username: result.data.username });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: "Error inesperado" };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cerrar sesi贸n
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Error al cerrar sesi贸n" };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    authenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;
