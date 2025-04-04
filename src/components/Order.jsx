import OrderHeader from "./OrderHeader";
import OrderInfo from "./OrderInfo";
import OrderProducts from "./OrderProducts";

// eslint-disable-next-line react/prop-types
const Order = ({ order, onSwitchChange }) => {
  return (
    <div className="order" id={order.amazonOrderId}>
      <OrderHeader order={order} onSwitchChange={onSwitchChange} />
      <OrderInfo order={order} />
      <OrderProducts order={order} />
    </div>
  );
};

export default Order;
