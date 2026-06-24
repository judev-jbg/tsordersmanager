import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TagLine from "./TagLine";

describe("TagLine", () => {
  it("shows its tooltip while hovered", () => {
    render(<TagLine statusOrder="pending" />);
    const tag = screen.getByText("pending");

    fireEvent.mouseEnter(tag);
    expect(screen.getByText("Estado del pedido")).toBeVisible();
    fireEvent.mouseLeave(tag);
    expect(screen.queryByText("Estado del pedido")).not.toBeInTheDocument();
  });
});
