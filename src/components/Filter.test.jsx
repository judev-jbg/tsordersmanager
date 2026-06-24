import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Filter from "./Filter";

describe("Filter", () => {
  it("shows its active state and reports its id on click", () => {
    const onClick = vi.fn();
    render(<Filter id={4} label="Sin stock" counter={2} active onClick={onClick} />);

    const filter = screen.getByText("Sin stock");
    expect(filter).toHaveClass("active");
    fireEvent.click(filter);
    expect(onClick).toHaveBeenCalledWith(4);
  });
});
