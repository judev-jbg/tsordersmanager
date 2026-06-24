import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import useShipmentActions from "./useShipmentActions";

const order = {
  amazonOrderId: "order-1",
  recipientName: "Ana",
  shipCountry: "ES",
  shipPostalCode: "28001",
  shipCity: "Madrid",
  shipPhoneNumber: "600000000",
};

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useShipmentActions", () => {
  it("creates a shipment with the formatted address", async () => {
    server.use(
      http.post("*/ordersreadytoship", async ({ request }) => {
        expect(await request.json()).toMatchObject({
          idOrder: "order-1",
          direccion: "Calle Mayor 1, 28001 Madrid",
        });
        return HttpResponse.json({ header: { status: "ok" } });
      })
    );

    const { result } = renderHook(() => useShipmentActions((country) => country));

    await expect(
      result.current.createShipment(order, "Calle Mayor 1, 28001 Madrid")
    ).resolves.toBe(true);
  });

  it("returns false when shipment creation fails", async () => {
    server.use(
      http.post("*/ordersreadytoship", () =>
        HttpResponse.json({ detail: "Unavailable" }, { status: 503 })
      )
    );

    const { result } = renderHook(() => useShipmentActions((country) => country));

    await expect(
      result.current.createShipment(order, "Calle Mayor 1, 28001 Madrid")
    ).resolves.toBe(false);
  });

  it("removes a shipment using its order identifier", async () => {
    server.use(
      http.delete("*/ordersreadytoship", async ({ request }) => {
        expect(await request.json()).toEqual({
          idOrder: "order-1",
          value: 0,
          shipmentType: "usingFile",
        });
        return HttpResponse.json({ header: { status: "ok" } });
      })
    );

    const { result } = renderHook(() => useShipmentActions((country) => country));

    await expect(result.current.removeShipment(order)).resolves.toBe(true);
  });
});
