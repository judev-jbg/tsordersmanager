import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OrderProducts from "./OrderProducts";

describe("OrderProducts", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports a missing order items contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<OrderProducts order={{}} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("items"),
      expect.any(String)
    );
  });

  it("renders totals with tax and shipping", () => {
    render(
      <OrderProducts
        order={{
          items: [
            {
              orderItemId: "item-1",
              quantityPurchased: 2,
              itemPrice: "24",
              vatExclusiveItemPrice: "20",
              itemTax: "4",
              shippingPrice: "6",
              shippingTax: "1",
              sku: "SKU-1",
              productName: "Producto",
            },
          ],
        }}
      />
    );

    expect(screen.getByText("30 €")).toBeInTheDocument();
    expect(screen.getByText(/TOTAL DEL PEDIDO: 30\.00€/)).toBeInTheDocument();
  });

  it("does not render NaN for missing monetary values", () => {
    render(
      <OrderProducts
        order={{
          items: [
            {
              orderItemId: "item-empty",
              quantityPurchased: 1,
              sku: "SKU-EMPTY",
              productName: "Producto vacío",
            },
          ],
        }}
      />
    );

    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
  });
});
