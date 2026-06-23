import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchBarModal from "./SearchBarModal";

describe("SearchBarModal", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports missing search callbacks contracts", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SearchBarModal open={false} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("close"),
      expect.any(String)
    );
  });
});
