const getBackgroundState = (statusOrder) => {
  const statusOrders = {
    Pendiente: "#28a745",
    "Pendiente de envío": "#cf3737",
    Enviado: "#4caf50",
    Cancelado: "#28a745",
    "Parcialmente enviado": "#28a745",
    "No se puede cumplir": "#28a745",
    "Factura sin confirmar": "#28a745",
    "Pendiente disponibilidad": "#28a745",
  };

  return statusOrders[statusOrder] || "#28a745";
};
export default getBackgroundState;
