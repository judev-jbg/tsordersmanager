import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useScrollVisibility from "./useScrollVisibility";

const ScrollIndicator = () => {
  const isVisible = useScrollVisibility(1500);
  return <span>{isVisible ? "visible" : "hidden"}</span>;
};

describe("useScrollVisibility", () => {
  it("registra un único listener y lo limpia al desmontar", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ScrollIndicator />);

    expect(screen.getByText("hidden")).toBeInTheDocument();
    expect(addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
