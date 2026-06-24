import { describe, expect, it } from "vitest";
import { ORDER_FILTERS } from "./orderFilters";

describe("order filters", () => {
  it("keeps the ordered order resources and their initial state", () => {
    expect(ORDER_FILTERS.map(({ resource }) => resource)).toEqual([
      "orderspending",
      "orderspending/untiltoday",
      "orderspending/delayed",
      "ordersoutofstock",
      "ordersoutofstock/untiltoday",
      "ordersoutofstock/delayed",
      "ordersshipfake",
    ]);
    expect(ORDER_FILTERS.filter(({ active }) => active)).toEqual([
      expect.objectContaining({ resource: "orderspending" }),
    ]);
    expect(ORDER_FILTERS.filter(({ newBlock }) => newBlock)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ resource: "ordersoutofstock" }),
        expect.objectContaining({ resource: "ordersshipfake" }),
      ])
    );
  });
});
