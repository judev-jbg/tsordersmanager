import PropTypes from "prop-types";
import OrderHeader from "./OrderHeader";
import OrderInfo from "./OrderInfo";
import OrderProducts from "./OrderProducts";

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

Order.propTypes = {
  order: PropTypes.shape({
    amazonOrderId: PropTypes.string.isRequired,
  }).isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  switchStates: PropTypes.object.isRequired,
};

export default Order;
