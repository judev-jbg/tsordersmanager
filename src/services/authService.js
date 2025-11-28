import api from "./api";

/**
 * Servicio de Autenticaci贸n JWT
 * Maneja login, logout y verificaci贸n de estado
 */

export const authService = {
  /**
   * Iniciar sesi贸n
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contrase帽a
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Error al iniciar sesión",
      };
    }
  },

  /**
   * Cerrar sesi贸n
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Error al cerrar sesión",
      };
    }
  },

  /**
   * Verificar si el usuario est谩 autenticado
   * @returns {Promise<Object>} - Estado de autenticaci贸n
   */
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/check");
      return {
        authenticated: response.data.authenticated,
        username: response.data.username,
      };
    } catch (error) {
      console.error("Error checking auth status:", error);
      return {
        authenticated: false,
        username: null,
      };
    }
  },

  /**
   * Obtener informaci贸n del usuario actual
   * @returns {Promise<Object>} - Datos del usuario
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Error al obtener usuario",
      };
    }
  },
};

export default authService;
