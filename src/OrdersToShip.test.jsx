import { describe, expect, it } from "vitest";
import { updateOrderCell } from "./utils/orderUtils";

const orders = [
  {
    idOrder: "order-1",
    observaciones: "Dejar en recepción",
    refC: "x",
  },
];

describe("updateOrderCell", () => {
  it("actualiza refC conservando exactamente el nombre de la propiedad", () => {
    expect(updateOrderCell(orders, "order-1", "refC", "y")).toEqual([
      { ...orders[0], refC: "y" },
    ]);
  });

  it.each(["refC", "observaciones"])(
    "permite vaciar %s aunque tuviera un valor anterior",
    (column) => {
      expect(updateOrderCell(orders, "order-1", column, "")).toEqual([
        { ...orders[0], [column]: "" },
      ]);
    }
  );
});
