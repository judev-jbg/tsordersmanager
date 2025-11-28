import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import TsOrdersApp from "./TsOrdersApp";
import OrdersToShip from "./OrdersToShip";
import OrdersShipmentsHistory from "./OrdersShipmentsHistory";

/**
 * App principal con sistema de autenticación JWT
 * - Ruta pública: /login
 * - Rutas protegidas: todas las demás requieren autenticación
 */
function App() {
  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas - Requieren autenticación */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TsOrdersApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders-to-ship"
        element={
          <ProtectedRoute>
            <OrdersToShip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders-shipments-history"
        element={
          <ProtectedRoute>
            <OrdersShipmentsHistory />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
