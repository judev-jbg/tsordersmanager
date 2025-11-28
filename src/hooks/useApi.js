import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * Hook personalizado para peticiones a la API
 * Simplifica el manejo de loading y errores
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Realizar petici贸n GET
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise<Object>} - Resultado de la petici贸n
   */
  const get = useCallback(async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "Error en la petici贸n");
      return { success: false, error: err };
    }
  }, []);

  /**
   * Realizar petici贸n POST
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Resultado de la petici贸n
   */
  const post = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, data);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "Error en la petici贸n");
      return { success: false, error: err };
    }
  }, []);

  /**
   * Realizar petici贸n PATCH
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Resultado de la petici贸n
   */
  const patch = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(endpoint, data);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "Error en la petici贸n");
      return { success: false, error: err };
    }
  }, []);

  /**
   * Realizar petici贸n DELETE
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Resultado de la petici贸n
   */
  const del = useCallback(async (endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoint, { data });
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "Error en la petici贸n");
      return { success: false, error: err };
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    patch,
    delete: del,
    clearError,
  };
};

export default useApi;
