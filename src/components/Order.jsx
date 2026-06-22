import OrderHeader from "./OrderHeader";
import OrderInfo from "./OrderInfo";
import OrderProducts from "./OrderProducts";

// eslint-disable-next-line react/prop-types
const Order = ({ order, onSwitchChange, switchStates }) => {
  return (
    <div className="order" id={order.amazonOrderId}>
      <OrderHeader
        order={order}
        onSwitchChange={onSwitchChange}
        switchStates={switchStates}
      />
      <OrderInfo order={order} />
      <OrderProducts order={order} />
    </div>
  );
};

export default Order;
