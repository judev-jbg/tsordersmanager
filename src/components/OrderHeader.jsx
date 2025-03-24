import Switch from "./Switch";
import TagLine from "./TagLine";

// eslint-disable-next-line react/prop-types
const OrderHeader = ({ order, onSwitchChange }) => {
  const handleSwitchChange = (id, isChecked, actionSwitch) => {
    onSwitchChange(id, isChecked, actionSwitch);
  };
  return (
    <div className="order-header">
      <span className="row-data">
        <span className="row-data-group order-id">
          <span className="label">Nº de pedido:</span>
          <span>171-3428225-4186734</span>
        </span>
        <span className="row-data-group separator">
          <TagLine statusOrder="Pendiente de envío" />
        </span>
        <span className="row-data-group separator">
          <Switch
            label="Sin stock" // eslint-disable-next-line react/prop-types
            checked={order.mark}
            onChange={handleSwitchChange}
            // eslint-disable-next-line react/prop-types
            id={`stock-${order.id}`}
            action="stock"
          />
        </span>
        <span className="row-data-group separator">
          <Switch
            label="Seleccionar para enviar"
            // eslint-disable-next-line react/prop-types
            checked={order.mark}
            onChange={handleSwitchChange}
            // eslint-disable-next-line react/prop-types
            id={`ship-${order.id}`}
            action="ship"
          />
        </span>
        <span className="row-data-group separator">
          <Switch
            label="Envio Fake"
            // eslint-disable-next-line react/prop-types
            checked={order.mark}
            onChange={handleSwitchChange}
            // eslint-disable-next-line react/prop-types
            id={`fake-${order.id}`}
            action="fake"
          />
        </span>
      </span>
      <span className="row-data">
        <span className="row-data-group">
          <span className="label">Pedido de este comprador:</span>
          <span>146</span>
        </span>
        <span className="row-data-group separator">
          <span className="label">Pedidos a esta dirección:</span>
          <span>256</span>
        </span>
      </span>
    </div>
  );
};

export default OrderHeader;
