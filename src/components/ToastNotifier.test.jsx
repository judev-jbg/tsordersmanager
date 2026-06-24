import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ToastNotifier from "./ToastNotifier";

describe("ToastNotifier", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports a missing toast type contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ToastNotifier message="Pedido guardado" />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("type"),
      expect.any(String)
    );
  });
});
