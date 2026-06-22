const actionPrefixes = {
  ship: "ship-",
  stock: "stock-",
  fake: "fake-",
};

const cleanPhoneNumber = (phoneNumber) =>
  phoneNumber
    ?.replace(" ", "")
    .replace(".0", "")
    .replace("+34", "")
    .replace("+34-", "") || "";

export const findOrderForAction = (orders, switchId, action) => {
  const prefix = actionPrefixes[action];
  if (!prefix) return null;

  return (
    orders.find(
      (order) => order.amazonOrderId === switchId.replace(prefix, "")
    ) || null
  );
};

export const buildShipmentRequest = (order, formattedAddress, getCountryCode) => {
  const recipient = order.recipientName?.replace(
    `PO${order.purchaseOrderNumber || ""}`,
    ""
  ) || "";
  const phone =
    cleanPhoneNumber(order.shipPhoneNumber) ||
    cleanPhoneNumber(order.buyerPhoneNumber) ||
    663142955;

  return {
    servicio: 37,
    horario: 3,
    destinatario: recipient,
    direccion: formattedAddress,
    pais: getCountryCode(order.shipCountry) || order.shipCountry,
    cp: order.shipPostalCode || "",
    poblacion: order.shipCity || "",
    telefono: phone,
    email: "orders@toolstock.info",
    departamento: order.amazonOrderId || "",
    contacto: recipient,
    observaciones: order.deliveryInstructions || "",
    bultos: 1,
    movil: phone,
    refC: order.purchaseOrderNumber || "",
    idOrder: order.amazonOrderId || "",
    process: "isFile",
    value: 1,
    shipmentType: "usingFile",
  };
};

export const getRevertedSwitchState = (isChecked) => (isChecked ? 0 : 1);
