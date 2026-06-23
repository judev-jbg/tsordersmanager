import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos

export const useSessionTimeout = (timeout = DEFAULT_TIMEOUT) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const timeoutRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await logout();
      navigate("/login");
    }, timeout);
  }, [timeout, logout, navigate]);

  useEffect(() => {
    // Eventos que reinician el timer
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Agregar listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Iniciar timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  return { resetTimer };
};

export default useSessionTimeout;
