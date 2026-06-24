const toNumber = (value) => Number.parseFloat(value) || 0;

export const calculateProductTotals = (item) => {
  const quantity = toNumber(item.quantityPurchased) || 1;
  const itemPrice = toNumber(item.itemPrice);
  const vatExclusiveItemPrice = toNumber(item.vatExclusiveItemPrice);
  const itemTax = toNumber(item.itemTax);
  const shippingPrice = toNumber(item.shippingPrice);
  const shippingTax = toNumber(item.shippingTax);
  const totalWithTax = itemPrice + shippingPrice;
  const totalTax = itemTax + shippingTax;

  return {
    unitWithoutTax: vatExclusiveItemPrice / quantity,
    unitWithTax: (vatExclusiveItemPrice + itemTax) / quantity,
    productWithoutTax: itemPrice - itemTax,
    shippingWithoutTax: shippingPrice - shippingTax,
    totalWithTax,
    totalWithoutTax: totalWithTax - totalTax,
    totalTax,
  };
};

export const calculateOrderTotal = (items) =>
  items.reduce(
    (total, item) => total + toNumber(item.itemPrice) + toNumber(item.shippingPrice),
    0
  );
