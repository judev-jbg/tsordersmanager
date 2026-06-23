import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OrderHeader from "./OrderHeader";

const order = {
  amazonOrderId: "order-1",
  orderStatus: "pending",
  pendingWithoutStock: 0,
  markForShipment: 0,
  isShipFake: 0,
  qOrders: 1,
  qOrderShip: 1,
};

describe("OrderHeader", () => {
  afterEach(() => vi.restoreAllMocks());

  it("accepts a numeric order number without a prop warning", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <OrderHeader
        order={{ ...order, num_order_ahora: 12345 }}
        onSwitchChange={vi.fn()}
        switchStates={{}}
      />
    );

    expect(consoleError).not.toHaveBeenCalled();
  });

  it("renders switch state provided by the parent", () => {
    const { rerender } = render(
      <OrderHeader order={order} onSwitchChange={vi.fn()} switchStates={{}} />
    );

    rerender(
      <OrderHeader
        order={order}
        onSwitchChange={vi.fn()}
        switchStates={{ "ship-order-1": 1 }}
      />
    );

    expect(
      screen.getByRole("checkbox", { name: "Seleccionar para enviar" })
    ).toBeChecked();
  });
});
