import TagRadius from "./TagRadius";
import Flag from "./Flag";
import Witness from "./Witness";
import Label from "./Label";

const OrderInfo = () => {
  return (
    <div className="order-info">
      <div className="order-info-sumary">
        <div className="order-info-title">Datos del pedido</div>
        <span className="order-info-channel">
          <Label
            text="Amazon.es"
            tooltipText="Canal"
            positionTooltip="right"
            needSplit={false}
          />
          <Flag channel="Amazon.es" />
        </span>

        <Label
          text="martes, 14 de ene. 2025"
          tooltipText="Fecha de compra"
          positionTooltip="right"
          needSplit={false}
        />
        <span className="order-info-latest-ship">
          <Label
            text="martes, 14 de ene. 2025"
            tooltipText="Fecha tope de envío"
            positionTooltip="right"
            needSplit={false}
          />
          <span className="order-info-witness">
            <Witness />
          </span>
        </span>
        <Label
          text="viernes, 17 de ene. 2025"
          tooltipText="Fecha tope de entrega"
          positionTooltip="right"
          needSplit={false}
        />
        <span className="order-info-tag-conatiner">
          <TagRadius statusOrder="Empresarial" tooltipText="Cliente" />
          <TagRadius statusOrder="Pago con IVA" tooltipText="Tipo de pago" />
        </span>
      </div>
      <div className="order-info-bill-invoice">
        <div className="order-info-title">
          Datos del comprador y facturación
        </div>
        <Label
          text="Amazon Business EU SARL"
          tooltipText="Usuario"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Spy Center - B12532867"
          tooltipText="Facturacion"
          positionTooltip="left"
          needSplit={!1}
        />
        <Label
          text="B12532867"
          tooltipText="NIF"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="38 avenue John F. Kennedy, Luxembourg City L-1855"
          tooltipText="Dirección"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Luxembourg City"
          tooltipText="Ciudad"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="LUXEMBURGO"
          tooltipText="País"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="+33 17 0394 955"
          tooltipText="Teléfono"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="no-reply-amazon-iba-buyer@marketplace.amazon.es"
          tooltipText="Email"
          positionTooltip="left"
          needSplit={false}
        />
      </div>
      <div className="order-info-shipping">
        <div className="order-info-title">Datos del envío</div>

        <Label
          text="Spy Center"
          tooltipText="Destinatario"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Virgen del socorro nº 90 B, 12550 Almassora, Castellon"
          tooltipText="Dirección"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Castellon"
          tooltipText="Provincia"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Almassora"
          tooltipText="Ciudad"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="12550"
          tooltipText="Codigo Postal"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="ESPAÑA"
          tooltipText="País"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="653938810"
          tooltipText="Teléfono"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="orders@toolstock.info"
          tooltipText="Email"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="406-2407986-8451515"
          tooltipText="Dpto"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Dejar en el portal"
          tooltipText="Obs"
          positionTooltip="left"
          needSplit={false}
        />
        <Label
          text="Taller"
          tooltipText="RefC"
          positionTooltip="left"
          needSplit={false}
        />
      </div>
    </div>
  );
};

export default OrderInfo;
