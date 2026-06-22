import { describe, expect, it } from "vitest";
import {
  buildShipmentRequest,
  findOrderForAction,
  getRevertedSwitchState,
} from "./orderActions";

const order = {
  amazonOrderId: "order-1",
  recipientName: "Ana POREF-1",
  purchaseOrderNumber: "REF-1",
  shipCountry: "ES",
  shipPostalCode: "28001",
  shipCity: "Madrid",
  shipPhoneNumber: "+34 600000000",
  buyerPhoneNumber: "611111111",
};

describe("order actions", () => {
  it("finds an order from a switch identifier", () => {
    expect(findOrderForAction([order], "ship-order-1", "ship")).toEqual(order);
  });

  it("returns null for an unknown action or missing order", () => {
    expect(findOrderForAction([order], "unknown-order-1", "unknown")).toBeNull();
    expect(findOrderForAction([order], "ship-missing", "ship")).toBeNull();
  });

  it("builds a shipment request using the formatted address", () => {
    expect(
      buildShipmentRequest(order, "Calle Mayor 1, 28001 Madrid", (country) =>
        country === "ES" ? 34 : country
      )
    ).toMatchObject({
      idOrder: "order-1",
      direccion: "Calle Mayor 1, 28001 Madrid",
      pais: 34,
      refC: "REF-1",
      destinatario: "Ana ",
      telefono: "600000000",
    });
  });

  it("returns the prior switch state after a failed action", () => {
    expect(getRevertedSwitchState(true)).toBe(0);
    expect(getRevertedSwitchState(false)).toBe(1);
  });
});
