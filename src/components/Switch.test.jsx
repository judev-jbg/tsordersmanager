import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Switch from "./Switch";

describe("Switch", () => {
  it("refleja cambios posteriores del valor checked del padre", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Switch
        id="ship-order-1"
        label="Enviar"
        checked={false}
        onChange={onChange}
        action="ship"
      />
    );

    rerender(
      <Switch
        id="ship-order-1"
        label="Enviar"
        checked
        onChange={onChange}
        action="ship"
      />
    );

    expect(screen.getByRole("checkbox", { name: "Enviar" })).toBeChecked();
  });
});
