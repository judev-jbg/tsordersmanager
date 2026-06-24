import PropTypes from "prop-types";
import Switch from "./Switch";
import TagLine from "./TagLine";
import useCopyToClipboard from "../hooks/useCopyToClipboard";

const OrderHeader = ({ order, onSwitchChange, switchStates = {} }) => {
  const stockChecked =
    switchStates[`stock-${order.amazonOrderId}`] ?? order.pendingWithoutStock;
  const shipChecked =
    switchStates[`ship-${order.amazonOrderId}`] ?? order.markForShipment;
  const fakeChecked =
    switchStates[`fake-${order.amazonOrderId}`] ?? order.isShipFake;
  const handleSwitchChange = (id, isChecked, actionSwitch) => {
    onSwitchChange(id, isChecked, actionSwitch);
  };
  const copyToClipboard = useCopyToClipboard();
  const handleCopySingle = (text) => {
    copyToClipboard(text);
  };
  return (
    <div className="order-header">
      <span className="row-data">
        <span className="row-data-group order-id">
          <span className="label">Pedido AMZ:</span>
          <span onClick={() => handleCopySingle(order.amazonOrderId)}>
            {order.amazonOrderId}
          </span>
        </span>
        {order.num_order_ahora &&(
        <span className="row-data-group order-id row-data-group separator">
          <span className="label">Pedido Ahora:</span>
          <span onClick={() => handleCopySingle(order.num_order_ahora)}>
            {order.num_order_ahora}
          </span>
        </span>

        )
        }

        {order.reference_ps && (
          <span className="row-data-group separator">{order.reference_ps}</span>
        )}
        <span className="row-data-group separator">
          <TagLine statusOrder={order.orderStatus} />
        </span>
        <span className="row-data-group separator">
          <Switch
            label="Sin stock"
            checked={stockChecked}
            onChange={handleSwitchChange}
            id={`stock-${order.amazonOrderId}`}
            action="stock"
          />
        </span>
        <span className="row-data-group separator">
          <Switch
            label="Seleccionar para enviar"
            checked={shipChecked}
            onChange={handleSwitchChange}
            id={`ship-${order.amazonOrderId}`}
            action="ship"
          />
        </span>
        {stockChecked ? (
          <span className="row-data-group separator">
            <Switch
              label="Envio Fake"
              checked={fakeChecked}
              onChange={handleSwitchChange}
              id={`fake-${order.amazonOrderId}`}
              action="fake"
            />
          </span>
        ) : (
          ""
        )}
      </span>
      <span className="row-data">
        <span className="row-data-group">
          {order.qOrders > 1 ? (
            <>
              <span className="label">Pedidos de este comprador:</span>
              <span>{order.qOrders}</span>
            </>
          ) : (
            <span className="label">Nuevo comprador</span>
          )}
        </span>
        <span className="row-data-group separator">
          {order.qOrderShip > 1 ? (
            <>
              <span className="label">Envíos a esta dirección:</span>
              <span>{order.qOrderShip}</span>
            </>
          ) : (
            <span className="label">Nueva dirección</span>
          )}
        </span>
        {order.expeditionTraking && (
          <span className="row-data-group separator">
            <>
              <span className="label">Expedición:</span>
              <span>{order.expeditionTraking}</span>
            </>
          </span>
        )}
        {order.expeditionTraking && (
          <span className="row-data-group separator">
            <a
              className="link-ship"
              target="_blank"
              href={`http://extranet.gls-spain.es/Extranet/public/ExpedicionASM.aspx?codigo=${
                order.expeditionTraking
              }&cpDst=${
                order.shipPostalCode && order.shipPostalCode.length === 4
                  ? `0${order.shipPostalCode}`
                  : order.shipPostalCode
              }`}
            >
              Ver envío
            </a>
          </span>
        )}
      </span>
    </div>
  );
};

OrderHeader.propTypes = {
  order: PropTypes.shape({
    amazonOrderId: PropTypes.string.isRequired,
    pendingWithoutStock: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    markForShipment: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    isShipFake: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    num_order_ahora: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reference_ps: PropTypes.string,
    orderStatus: PropTypes.string,
    qOrders: PropTypes.number,
    qOrderShip: PropTypes.number,
    expeditionTraking: PropTypes.string,
    shipPostalCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onSwitchChange: PropTypes.func.isRequired,
  switchStates: PropTypes.object,
};

export default OrderHeader;
