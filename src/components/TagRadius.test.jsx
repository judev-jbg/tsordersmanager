import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TagRadius from "./TagRadius";

describe("TagRadius", () => {
  it("shows its configured tooltip while hovered", () => {
    render(<TagRadius label="Empresarial" tooltipText="Cliente" />);
    const tag = screen.getByText("Empresarial");

    fireEvent.mouseEnter(tag);
    expect(screen.getByText("Cliente")).toBeVisible();
    fireEvent.mouseLeave(tag);
    expect(screen.queryByText("Cliente")).not.toBeInTheDocument();
  });
});
