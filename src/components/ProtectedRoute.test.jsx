import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../context/AuthContext", () => ({
  useAuthContext: () => ({ authenticated: true, loading: false }),
}));

describe("ProtectedRoute", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reports a missing children contract", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ProtectedRoute />);

    expect(consoleError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.stringContaining("children"),
      expect.any(String)
    );
  });
});
