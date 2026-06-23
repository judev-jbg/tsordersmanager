import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductImage from "./ProductImage";

describe("ProductImage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("reports an invalid supplier reference contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    render(<ProductImage referenciaProv={123} productName="Producto" />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("referenciaProv"),
      expect.any(String)
    );
  });
});
