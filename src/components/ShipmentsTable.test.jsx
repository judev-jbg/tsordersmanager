import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShipmentsTable from "./ShipmentsTable";

describe("ShipmentsTable", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("reports missing shipment data and export handler contracts", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ShipmentsTable data={[]} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("onExportClick"),
      expect.any(String)
    );
  });

  it("exports a generated file", () => {
    const onExportClick = vi.fn();

    render(
      <ShipmentsTable
        data={[
          {
            shippingMethod: "isFile",
            fileGenerateName: "shipment.xlsx",
            updateDateTime: "2025-01-01T10:00:00Z",
          },
        ]}
        onExportClick={onExportClick}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /exportar/i }));

    expect(onExportClick).toHaveBeenCalledWith("shipment.xlsx");
  });

  it("does not expose an export action for webservice shipments", () => {
    render(
      <ShipmentsTable
        data={[
          {
            shippingMethod: "isWS",
            fileGenerateName: "shipment.xlsx",
            updateDateTime: "2025-01-01T10:00:00Z",
          },
        ]}
        onExportClick={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /exportar/i })).toBeDisabled();
  });
});
