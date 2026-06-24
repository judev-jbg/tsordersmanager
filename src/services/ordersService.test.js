import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import ordersService from "./ordersService";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ordersService", () => {
  it("returns an empty list when ready-to-ship payload is missing", async () => {
    server.use(
      http.get("*/ordersreadytoship", () =>
        HttpResponse.json({ header: { status: "ok" } })
      )
    );

    await expect(ordersService.getReadyToShip()).resolves.toEqual([]);
  });

  it("updates an editable cell without transforming an empty value", async () => {
    server.use(
      http.patch("*/ordersreadytoship", async ({ request }) => {
        expect(await request.json()).toEqual({
          idOrder: "order-1",
          columnName: "refC",
          columnValue: "",
        });

        return HttpResponse.json({
          header: { status: "ok", updatedRows: 1 },
          message: "Registro actualizado",
        });
      })
    );

    await expect(
      ordersService.updateReadyToShipCell("order-1", "refC", "")
    ).resolves.toBe(true);
  });

  it("returns shipment history details", async () => {
    server.use(
      http.get("*/ordershistory/shipment.xlsx", () =>
        HttpResponse.json({
          header: { status: "ok", content: 1 },
          payload: [{ idOrder: "order-1" }],
        })
      )
    );

    await expect(
      ordersService.getShipmentHistory("shipment.xlsx")
    ).resolves.toEqual([{ idOrder: "order-1" }]);
  });

  it("rejects when the API request fails", async () => {
    server.use(
      http.get("*/ordershistory", () =>
        HttpResponse.json({ detail: "Service unavailable" }, { status: 503 })
      )
    );

    await expect(ordersService.getShipmentList()).rejects.toMatchObject({
      response: { status: 503 },
    });
  });
});
