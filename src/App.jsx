import { Routes, Route } from "react-router-dom";
import TsOrdersApp from "./TsOrdersApp";
import OrdersToShip from "./OrdersToShip";
import OrdersShipmentsHistory from "./OrdersShipmentsHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TsOrdersApp />} />
      <Route path="/orders-to-ship" element={<OrdersToShip />} />
      <Route
        path="/orders-shipments-history"
        element={<OrdersShipmentsHistory />}
      />
    </Routes>
  );
}

export default App;
