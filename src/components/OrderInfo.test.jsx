import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OrderInfo from "./OrderInfo";

const order = {
  amazonOrderId: "order-1",
  salesChannel: "Amazon.es",
  purchaseDate: "2025-01-01",
  latestShipDate: "2025-01-03",
  latestDeliveryDate: "2025-01-05",
  isBusinessOrder: 0,
  items: [{ itemTax: 0 }],
  buyerName: "Comprador",
  billName: "",
  buyerTaxRegistrationId: "",
  billAddress1: "Calle Factura 1",
  billAddress2: "",
  billAddress3: "",
  billPostalCode: "28001",
  billCity: "Madrid",
  billState: "Madrid",
  billCountry: "ES",
  buyerPhoneNumber: "600000000",
  buyerEmail: "buyer@example.com",
  recipientName: "Destinatario",
  purchaseOrderNumber: "",
  shipAddress1: "Calle Envío 1",
  shipAddress2: "",
  shipAddress3: "",
  shipPostalCode: "08001",
  shipCity: "Barcelona",
  shipState: "Barcelona",
  shipCountry: "ES",
  shipPhoneNumber: "611111111",
  deliveryInstructions: "",
};

describe("OrderInfo", () => {
  it("mantiene el renderizado al desaparecer una dirección de facturación", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(<OrderInfo order={order} />);

    expect(() =>
      rerender(<OrderInfo order={{ ...order, billAddress1: "" }} />)
    ).not.toThrow();

    expect(screen.getByText("Datos del envío")).toBeInTheDocument();
  });
});
