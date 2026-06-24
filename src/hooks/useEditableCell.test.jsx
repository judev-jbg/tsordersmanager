import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useEditableCell from "./useEditableCell";

describe("useEditableCell", () => {
  it("opens a cell with its current and original values", () => {
    const { result } = renderHook(() => useEditableCell(vi.fn()));

    act(() => result.current.open("order-1", "refC", "ABC"));

    expect(result.current.cell).toMatchObject({
      rowId: "order-1",
      column: "refC",
      value: "ABC",
      originalValue: "ABC",
    });
  });

  it("saves a valid empty value", async () => {
    const onUpdate = vi.fn().mockResolvedValue(true);
    const { result } = renderHook(() => useEditableCell(onUpdate));

    act(() => result.current.open("order-1", "refC", "ABC"));
    act(() => result.current.change(""));
    await act(() => result.current.save());

    expect(onUpdate).toHaveBeenCalledWith("order-1", "refC", "");
    expect(result.current.cell.rowId).toBeNull();
  });

  it("does not save an invalid value", async () => {
    const onUpdate = vi.fn();
    const { result } = renderHook(() => useEditableCell(onUpdate));

    act(() => result.current.open("order-1", "movil", "600"));
    act(() => result.current.change("invalid"));
    await act(() => result.current.save());

    expect(onUpdate).not.toHaveBeenCalled();
  });
});
