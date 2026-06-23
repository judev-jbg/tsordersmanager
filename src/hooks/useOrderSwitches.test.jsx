import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import api from "../services/api";
import useOrderSwitches from "./useOrderSwitches";

vi.mock("../services/api", () => ({
  default: { patch: vi.fn() },
}));

const orders = [
  {
    amazonOrderId: "order-1",
    markForShipment: 0,
    shipAddress1: "Calle 1",
  },
];

describe("useOrderSwitches", () => {
  it("prepares a shipment and updates its visual state", async () => {
    const { result } = renderHook(() =>
      useOrderSwitches({ orders, setFilters: vi.fn(), removeShipment: vi.fn() })
    );

    await act(() => result.current.handleSwitchChange("ship-order-1", true, "ship"));

    expect(result.current.switchStates["ship-order-1"]).toBe(1);
    expect(result.current.shipSwitchCount).toBe(1);
    expect(result.current.addressToFormat).toMatchObject({
      targetOrder: orders[0],
    });
  });

  it("reverts a stock switch when the request fails", async () => {
    api.patch.mockRejectedValueOnce(new Error("network"));
    const { result } = renderHook(() =>
      useOrderSwitches({ orders, setFilters: vi.fn(), removeShipment: vi.fn() })
    );

    await act(() => result.current.handleSwitchChange("stock-order-1", true, "stock"));

    expect(result.current.switchStates["stock-order-1"]).toBe(0);
  });

  it("updates stock counters after a successful stock action", async () => {
    api.patch.mockResolvedValueOnce({ data: { message: "Registro actualizado" } });
    const setFilters = vi.fn();
    const { result } = renderHook(() =>
      useOrderSwitches({ orders, setFilters, removeShipment: vi.fn() })
    );

    await act(() => result.current.handleSwitchChange("stock-order-1", true, "stock"));

    expect(setFilters).toHaveBeenCalledOnce();
    expect(result.current.switchStates["stock-order-1"]).toBe(1);
  });

  it("ignores an unknown switch action", async () => {
    const { result } = renderHook(() =>
      useOrderSwitches({ orders, setFilters: vi.fn(), removeShipment: vi.fn() })
    );

    await act(() => result.current.handleSwitchChange("other-order-1", true, "other"));

    expect(result.current.switchStates).toEqual({ "ship-order-1": 0 });
  });
});
