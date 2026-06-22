export const updateOrderCell = (orders, rowId, columnName, columnValue) =>
  orders.map((order) =>
    order.idOrder === rowId ? { ...order, [columnName]: columnValue } : order
  );
