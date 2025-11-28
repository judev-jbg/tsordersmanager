import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // En desarrollo usar base /, en producción usar /tsordersmanager/dist/
    base: mode === "development" ? "/" : "/tsordersmanager/dist/",
    server: {
      port: 5173,
      strictPort: false,
    },
  };
});
