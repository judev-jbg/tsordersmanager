import axios from "axios";

// Configuracion de Axios con JWT httpOnly cookies
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // IMPORTANTE: Permite enviar cookies httpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos 401 y no hemos reintentado, intentar refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar renovar el access token
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Reintentar la peticion original
        return api(originalRequest);
      } catch (refreshError) {
        // Solo redirigir si NO estamos ya en /login
        if (!window.location.hash.includes("login")) {
          window.location.href = "/#/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
