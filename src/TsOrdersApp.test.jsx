import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TsOrdersApp from "./TsOrdersApp";

const submitShipment = vi.fn().mockResolvedValue(true);
const clearAddressToFormat = vi.fn();
const addressToFormat = { targetOrder: { amazonOrderId: "order-1" } };

vi.mock("./components/Header", () => ({ default: () => null }));
vi.mock("./components/Filters", () => ({ default: () => null }));
vi.mock("./components/Order", () => ({ default: () => null }));
vi.mock("./components/OrderSkeleton", () => ({ default: () => null }));
vi.mock("./components/SearchNoResult", () => ({ default: () => null }));
vi.mock("./components/SearchBarModal", () => ({ default: () => null }));
vi.mock("./hooks/useSessionTimeout", () => ({ default: () => {} }));
vi.mock("./hooks/useCodCountry", () => ({ default: () => vi.fn() }));
vi.mock("./hooks/useScrollVisibility", () => ({ default: () => false }));
vi.mock("./hooks/useAddressFormatter", () => ({ default: () => "Calle 1" }));
vi.mock("./hooks/useOrderResources", () => ({
  default: () => ({ filters: [], orders: [], loading: false, selectFilter: vi.fn(), setFilters: vi.fn(), setOrders: vi.fn() }),
}));
vi.mock("./hooks/useShipmentActions", () => ({ default: () => ({ createShipment: vi.fn(), removeShipment: vi.fn() }) }));
vi.mock("./hooks/useShipmentFlow", () => ({ default: () => ({ submit: submitShipment }) }));
vi.mock("./hooks/useOrderSwitches", () => ({
  default: () => ({ switchStates: {}, setSwitchStates: vi.fn(), shipSwitchCount: 0, isAnySwitchChecked: false, addressToFormat, clearAddressToFormat, handleSwitchChange: vi.fn() }),
}));

describe("TsOrdersApp shipment flow", () => {
  afterEach(() => vi.clearAllMocks());

  it("submits a pending shipment once", async () => {
    render(<TsOrdersApp />);

    await waitFor(() => expect(submitShipment).toHaveBeenCalledTimes(1));
    expect(submitShipment).toHaveBeenCalledWith(addressToFormat.targetOrder, "Calle 1");
  });
});
