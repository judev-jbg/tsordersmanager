import { describe, expect, it } from "vitest";
import { calculateOrderTotal, calculateProductTotals } from "./orderProductTotals";

describe("order product totals", () => {
  it("calculates unit, shipment and tax amounts", () => {
    expect(
      calculateProductTotals({
        quantityPurchased: 2,
        itemPrice: "24",
        vatExclusiveItemPrice: "20",
        itemTax: "4",
        shippingPrice: "6",
        shippingTax: "1",
      })
    ).toMatchObject({
      unitWithoutTax: 10,
      unitWithTax: 12,
      totalWithTax: 30,
      totalTax: 5,
    });
  });

  it("treats missing monetary fields as zero", () => {
    expect(calculateProductTotals({ quantityPurchased: 1 })).toMatchObject({
      totalWithTax: 0,
      totalTax: 0,
    });
  });

  it("calculates an order total across multiple items", () => {
    expect(
      calculateOrderTotal([
        { itemPrice: "10", shippingPrice: "2" },
        { itemPrice: "5", shippingPrice: "0" },
      ])
    ).toBe(17);
  });
});
