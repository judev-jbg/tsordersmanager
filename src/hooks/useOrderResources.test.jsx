import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import useOrderResources from "./useOrderResources";

const filters = [
  { id: 1, resource: "orderspending", counter: 0, active: true },
  { id: 2, resource: "ordersoutofstock", counter: 0, active: false },
];

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useOrderResources", () => {
  it("loads configured resources, counters, and the active resource", async () => {
    server.use(
      http.get("*/orderspending", () =>
        HttpResponse.json({
          header: { status: "ok", resource: "orderspending", count: 3 },
          payload: [{ amazonOrderId: "order-1" }],
        })
      ),
      http.get("*/ordersoutofstock", () =>
        HttpResponse.json({
          header: { status: "ok", resource: "ordersoutofstock", count: 2 },
          payload: [{ amazonOrderId: "order-2" }],
        })
      )
    );

    const { result } = renderHook(() => useOrderResources(filters));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.orders).toEqual([{ amazonOrderId: "order-1" }]);
    expect(result.current.filters).toEqual([
      { ...filters[0], counter: 3 },
      { ...filters[1], counter: 2 },
    ]);
  });

  it("loads the selected filter and updates only its active state", async () => {
    server.use(
      http.get("*/orderspending", () =>
        HttpResponse.json({
          header: { status: "ok", resource: "orderspending", count: 3 },
          payload: [{ amazonOrderId: "order-1" }],
        })
      ),
      http.get("*/ordersoutofstock", () =>
        HttpResponse.json({
          header: { status: "ok", resource: "ordersoutofstock", count: 2 },
          payload: [{ amazonOrderId: "order-2" }],
        })
      )
    );

    const { result } = renderHook(() => useOrderResources(filters));

    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.selectFilter(2);

    await waitFor(() =>
      expect(result.current.orders).toEqual([{ amazonOrderId: "order-2" }])
    );
    expect(result.current.filters).toEqual([
      { ...filters[0], active: false, counter: 3 },
      { ...filters[1], active: true, counter: 2 },
    ]);
  });

  it("stops loading and keeps prior orders when selecting a failing resource", async () => {
    let outOfStockRequests = 0;

    server.use(
      http.get("*/orderspending", () =>
        HttpResponse.json({
          header: { status: "ok", resource: "orderspending", count: 3 },
          payload: [{ amazonOrderId: "order-1" }],
        })
      ),
      http.get("*/ordersoutofstock", () => {
        outOfStockRequests += 1;
        return outOfStockRequests === 1
          ? HttpResponse.json({
              header: { status: "ok", resource: "ordersoutofstock", count: 2 },
              payload: [{ amazonOrderId: "order-2" }],
            })
          : HttpResponse.json({ detail: "Unavailable" }, { status: 503 });
      })
    );

    const { result } = renderHook(() => useOrderResources(filters));

    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.selectFilter(2);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.orders).toEqual([{ amazonOrderId: "order-1" }]);
  });
});
