import { useCallback } from "react";

const useCopyToClipboard = () => {
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err);
      });
  }, []);

  return copyToClipboard;
};

export default useCopyToClipboard;
