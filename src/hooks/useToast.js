import { useState, useCallback } from "react";

/**
 * Hook personalizado para manejar notificaciones Toast
 * Elimina la duplicaci贸n de la funci贸n showToast en m煤ltiples componentes
 */
export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "", // 'success', 'error', 'warning', 'info'
  });

  /**
   * Mostrar notificaci贸n toast
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificaci贸n
   */
  const showToast = useCallback(
    (message, type = "info") => {
      setToast({ visible: true, message, type });

      setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
      }, duration);
    },
    [duration]
  );

  /**
   * Cerrar manualmente el toast
   */
  const hideToast = useCallback(() => {
    setToast({ visible: false, message: "", type: "" });
  }, []);

  /**
   * Mostrar toast de 茅xito
   */
  const success = useCallback(
    (message) => showToast(message, "success"),
    [showToast]
  );

  /**
   * Mostrar toast de error
   */
  const error = useCallback(
    (message) => showToast(message, "error"),
    [showToast]
  );

  /**
   * Mostrar toast de advertencia
   */
  const warning = useCallback(
    (message) => showToast(message, "warning"),
    [showToast]
  );

  /**
   * Mostrar toast de informaci贸n
   */
  const info = useCallback((message) => showToast(message, "info"), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
