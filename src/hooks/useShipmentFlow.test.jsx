import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useShipmentFlow from "./useShipmentFlow";

const order = { amazonOrderId: "order-1" };

describe("useShipmentFlow", () => {
  it("clears the pending address after a successful shipment", async () => {
    const createShipment = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() => useShipmentFlow(createShipment));

    await act(() => result.current.submit(order, "Calle Mayor 1"));

    expect(createShipment).toHaveBeenCalledWith(order, "Calle Mayor 1");
    expect(result.current.pendingOrder).toBeNull();
  });

  it("clears pending data and reports failure when creation fails", async () => {
    const createShipment = vi.fn().mockResolvedValue(false);
    const { result } = renderHook(() => useShipmentFlow(createShipment));

    await act(() => result.current.submit(order, "Calle Mayor 1"));

    expect(result.current.pendingOrder).toBeNull();
    expect(result.current.lastResult).toEqual({ orderId: "order-1", success: false });
  });
});
