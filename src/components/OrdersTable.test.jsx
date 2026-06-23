import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OrdersTable from "./OrdersTable";

const row = {
  idOrder: "order-1",
  refC: "REF-1",
};

describe("OrdersTable", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("reports a missing cell update handler contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<OrdersTable data={[]} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("onCellUpdate"),
      expect.any(String)
    );
  });

  it("saves an empty refC value after editing", async () => {
    const onCellUpdate = vi.fn().mockResolvedValue(true);

    render(<OrdersTable data={[row]} onCellUpdate={onCellUpdate} />);

    fireEvent.doubleClick(screen.getByText("REF-1"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(onCellUpdate).toHaveBeenCalledWith("order-1", "refC", "");
    });
  });
});
