import PropTypes from "prop-types";
import TagRadius from "./TagRadius";
import Flag from "./Flag";
import Witness from "./Witness";
import Label from "./Label";
import useFormatDate from "../hooks/useFormatDate";
import useIsOutOfTime from "../hooks/useIsOutOfTime";
import useAddressFormatter from "../hooks/useAddressFormatter";
import useCountry from "../hooks/useCountry";
import {
  formatPostalCode,
  formatRecipient,
  normalizePhone,
} from "../utils/orderDisplay";

const OrderInfo = ({ order }) => {
  const {
    billAddress1,
    billAddress2,
    billAddress3,
    billPostalCode,
    billCity,
    billState,
    shipAddress1,
    shipAddress2,
    shipAddress3,
    shipPostalCode,
    shipCity,
    shipState,
  } = order;
  const addressShipData = {
    shipAddress1,
    shipAddress2,
    shipAddress3,
    shipPostalCode,
    shipCity,
    shipState,
  };
  const addressBillData = {
    billAddress1,
    billAddress2,
    billAddress3,
    billPostalCode,
    billCity,
    billState,
  };
  const getCountryName = useCountry();
  const billingAddress = useAddressFormatter(addressBillData);
  const shippingAddress = useAddressFormatter(addressShipData);

  return (
    <div className="order-info">
      <div className="order-info-sumary">
        <div className="order-info-title">Datos del pedido</div>
        <span className="order-info-channel">
          <Label
            text={order.salesChannel}
            tooltipText="Canal"
            positionTooltip="right"
            needSplit={false}
          />
          <Flag channel={order.salesChannel} />
        </span>

        <Label
          text={useFormatDate(order.purchaseDate)}
          tooltipText="Fecha de compra"
          positionTooltip="right"
          needSplit={false}
        />
        <span className="order-info-latest-ship">
          <Label
            text={useFormatDate(order.latestShipDate)}
            tooltipText="Fecha tope de envío"
            positionTooltip="right"
            needSplit={false}
          />
          {useIsOutOfTime(order.latestShipDate) && (
            <span className="order-info-witness">
              <Witness />
            </span>
          )}
        </span>
        <Label
          text={useFormatDate(order.latestDeliveryDate)}
          tooltipText="Fecha tope de entrega"
          positionTooltip="right"
          needSplit={false}
        />
        <span className="order-info-tag-conatiner">
          {order.isBusinessOrder === 1 && (
            <TagRadius label="Empresarial" tooltipText="Cliente" />
          )}
          {order.items[0].itemTax > 0 ? (
            <TagRadius label="Pago con IVA" tooltipText="Tipo de pago" />
          ) : (
            <TagRadius label="Pago sin IVA" tooltipText="Tipo de pago" />
          )}
        </span>
      </div>
      <div className="order-info-bill-invoice">
        <div className="order-info-title">
          Datos del comprador y facturación
        </div>
        <Label
          text={order.buyerName}
          tooltipText="Usuario"
          positionTooltip="left"
          needSplit={!order.isBusinessOrder}
        />
        {order.billName && (
          <Label
            text={order.billName}
            tooltipText="Facturacion"
            positionTooltip="left"
            needSplit={!order.isBusinessOrder}
          />
        )}
        {order.buyerTaxRegistrationId && (
          <Label
            text={order.buyerTaxRegistrationId.replace("ES", "")}
            tooltipText="NIF"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        {order.billAddress1 && (
          <Label
            text={billingAddress}
            tooltipText="Dirección"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        {order.billCity && (
          <Label
            text={order.billCity}
            tooltipText="Ciudad"
            positionTooltip="left"
            needSplit={false}
          />
        )}
        {order.billState && (
          <Label
            text={order.billState}
            tooltipText="Provincia"
            positionTooltip="left"
            needSplit={false}
          />
        )}
        {order.billPostalCode && (
          <Label
            text={formatPostalCode(order.billPostalCode)}
            tooltipText="Provincia"
            positionTooltip="left"
            needSplit={false}
          />
        )}
        {order.billCountry && (
          <Label
            text={getCountryName(order.billCountry)}
            tooltipText="País"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        {order.buyerPhoneNumber && (
          <Label
            text={normalizePhone(order.buyerPhoneNumber)}
            tooltipText="Teléfono"
            positionTooltip="left"
            needSplit={false}
          />
        )}
        {order.buyerEmail && (
          <Label
            text={order.buyerEmail}
            tooltipText="Email"
            positionTooltip="left"
            needSplit={false}
          />
        )}
      </div>
      <div className="order-info-shipping">
        <div className="order-info-title">Datos del envío</div>

        {order.purchaseOrderNumber ? (
          <Label
            text={formatRecipient(
              order.recipientName,
              order.purchaseOrderNumber
            )}
            tooltipText="Destinatario"
            positionTooltip="left"
            needSplit={!order.isBusinessOrder}
          />
        ) : (
          <Label
            text={order.recipientName}
            tooltipText="Destinatario"
            positionTooltip="left"
            needSplit={!order.isBusinessOrder}
          />
        )}

        <Label
          text={shippingAddress}
          tooltipText="Dirección"
          positionTooltip="left"
          needSplit={false}
        />
        {order.shipState && (
          <Label
            text={order.shipState}
            tooltipText="Provincia"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        {order.shipCity && (
          <Label
            text={order.shipCity}
            tooltipText="Ciudad"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        <Label
          text={formatPostalCode(order.shipPostalCode)}
          tooltipText="Codigo Postal"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text={getCountryName(order.shipCountry)}
          tooltipText="País"
          positionTooltip="left"
          needSplit={false}
        />
        {order.shipPhoneNumber && (
          <Label
            text={normalizePhone(order.shipPhoneNumber)}
            tooltipText="Teléfono"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        <Label
          text="orders@toolstock.info"
          tooltipText="Email"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text={order.amazonOrderId}
          tooltipText="Dpto"
          positionTooltip="left"
          needSplit={false}
        />
        {order.deliveryInstructions && (
          <Label
            text={order.deliveryInstructions}
            tooltipText="Obs"
            positionTooltip="left"
            needSplit={false}
          />
        )}

        {order.purchaseOrderNumber && (
          <Label
            text={order.purchaseOrderNumber}
            tooltipText="RefC"
            positionTooltip="left"
            needSplit={false}
          />
        )}
      </div>
    </div>
  );
};

OrderInfo.propTypes = {
  order: PropTypes.shape({
    amazonOrderId: PropTypes.string,
    salesChannel: PropTypes.string,
    purchaseDate: PropTypes.string,
    latestShipDate: PropTypes.string,
    latestDeliveryDate: PropTypes.string,
    isBusinessOrder: PropTypes.oneOf([0, 1]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        itemTax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    buyerName: PropTypes.string,
    billName: PropTypes.string,
    buyerTaxRegistrationId: PropTypes.string,
    billAddress1: PropTypes.string,
    billAddress2: PropTypes.string,
    billAddress3: PropTypes.string,
    billPostalCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    billCity: PropTypes.string,
    billState: PropTypes.string,
    billCountry: PropTypes.string,
    buyerPhoneNumber: PropTypes.string,
    buyerEmail: PropTypes.string,
    recipientName: PropTypes.string,
    purchaseOrderNumber: PropTypes.string,
    shipAddress1: PropTypes.string,
    shipAddress2: PropTypes.string,
    shipAddress3: PropTypes.string,
    shipPostalCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shipCity: PropTypes.string,
    shipState: PropTypes.string,
    shipCountry: PropTypes.string,
    shipPhoneNumber: PropTypes.string,
    deliveryInstructions: PropTypes.string,
  }).isRequired,
};

export default OrderInfo;
