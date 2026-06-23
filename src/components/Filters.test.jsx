import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Filters from "./Filters";

describe("Filters", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports a missing filter handler contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Filters filters={[]} />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("onFilterClick"),
      expect.any(String)
    );
  });
});
