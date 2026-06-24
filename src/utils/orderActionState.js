export const buildStockRequest = (idOrder, isChecked) => ({
  idOrder,
  withoutstock: isChecked ? 1 : 0,
});

export const buildFakeRequest = (idOrder, isChecked) => ({
  idOrder,
  isFake: isChecked ? 1 : 0,
});

export const updateStockFilterCounters = (filters, isChecked) => {
  const delta = isChecked ? -1 : 1;

  return filters.map((filter) => {
    if (filter.resource === "orderspending") {
      return { ...filter, counter: filter.counter + delta };
    }
    if (filter.resource === "ordersoutofstock") {
      return { ...filter, counter: filter.counter - delta };
    }
    return filter;
  });
};
