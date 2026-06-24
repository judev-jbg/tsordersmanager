import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchNoResult from "./SearchNoResult";

describe("SearchNoResult", () => {
  it("renders the filter empty message and optional class", () => {
    const { container } = render(<SearchNoResult className="compact" />);

    expect(
      screen.getByText("No se encontraron órdenes para este filtro")
    ).toBeVisible();
    expect(container.querySelector(".no-results-container")).toHaveClass("compact");
  });
});
