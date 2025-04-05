import { Routes, Route } from "react-router-dom";
import TsOrdersApp from "./TsOrdersApp";
import OrdersToShip from "./OrdersToShip";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TsOrdersApp />} />
      <Route path="/orders-to-ship" element={<OrdersToShip />} />
    </Routes>
  );
}

export default App;
