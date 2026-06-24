import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ImageWithOutOrders from "./ImageWithOutOrders";

describe("ImageWithOutOrders", () => {
  it("renders the empty shipment message and optional class", () => {
    const { container } = render(<ImageWithOutOrders className="compact" />);

    expect(screen.getByText("No hay órdenes listas para enviar")).toBeVisible();
    expect(container.querySelector(".no-results-container")).toHaveClass("compact");
  });
});
