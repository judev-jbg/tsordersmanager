export const ORDER_FILTERS = [
  { id: 1, resource: "orderspending", label: "Pendientes de envío", newBlock: false, counter: 0, active: true },
  { id: 2, resource: "orderspending/untiltoday", label: "hoy", newBlock: false, counter: 0, active: false },
  { id: 3, resource: "orderspending/delayed", label: "Vencidos", newBlock: false, counter: 0, active: false },
  { id: 4, resource: "ordersoutofstock", label: "Pendientes de envío - Sin stock", newBlock: true, counter: 0, active: false },
  { id: 5, resource: "ordersoutofstock/untiltoday", label: "hoy", newBlock: false, counter: 0, active: false },
  { id: 6, resource: "ordersoutofstock/delayed", label: "Vencidos", newBlock: false, counter: 0, active: false },
  { id: 7, resource: "ordersshipfake", label: "Envios fake", newBlock: true, counter: 0, active: false },
];
