import OrderHeader from "./OrderHeader";
import OrderInfo from "./OrderInfo";
import OrderProducts from "./OrderProducts";

// eslint-disable-next-line react/prop-types
const Order = ({ order, onSwitchChange }) => {
  return (
    <div className="order">
      <OrderHeader order={order} onSwitchChange={onSwitchChange} />
      <OrderInfo />
      <OrderProducts />
    </div>
  );
};

export default Order;
