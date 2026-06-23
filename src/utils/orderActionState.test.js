import { describe, expect, it } from "vitest";
import {
  buildFakeRequest,
  buildStockRequest,
  updateStockFilterCounters,
} from "./orderActionState";

describe("order action state", () => {
  it("builds a stock request", () => {
    expect(buildStockRequest("order-1", true)).toEqual({
      idOrder: "order-1",
      withoutstock: 1,
    });
  });

  it("builds a fake shipment request", () => {
    expect(buildFakeRequest("order-1", false)).toEqual({
      idOrder: "order-1",
      isFake: 0,
    });
  });

  it("moves counters between pending and out-of-stock", () => {
    const filters = [
      { resource: "orderspending", counter: 5 },
      { resource: "ordersoutofstock", counter: 2 },
    ];

    expect(updateStockFilterCounters(filters, true)).toEqual([
      { resource: "orderspending", counter: 4 },
      { resource: "ordersoutofstock", counter: 3 },
    ]);
  });
});
