import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useInitialLoad from "./useInitialLoad";

describe("useInitialLoad", () => {
  it("runs the loader once on mount", async () => {
    const loader = vi.fn().mockResolvedValue(undefined);

    renderHook(() => useInitialLoad(loader));

    await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
  });

  it("does not rerun the loader during a local rerender", async () => {
    const loader = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(() => useInitialLoad(loader));

    await waitFor(() => expect(loader).toHaveBeenCalledTimes(1));
    rerender();

    expect(loader).toHaveBeenCalledTimes(1);
  });
});
