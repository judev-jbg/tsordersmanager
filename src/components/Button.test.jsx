import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Button from "./Button";

const CurrentPath = () => <span>{useLocation().pathname}</span>;

describe("Button", () => {
  it("navigates to orders ready to ship", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Button shipCount={2} />
        <CurrentPath />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /preparar envios/i }));

    expect(screen.getByText("/orders-to-ship")).toBeInTheDocument();
  });
});
