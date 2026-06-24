import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("opens the search flow on click", () => {
    const handlerModalSearch = vi.fn();
    render(<SearchBar handlerModalSearch={handlerModalSearch} />);

    fireEvent.click(screen.getByPlaceholderText("Buscar pedido..."));

    expect(handlerModalSearch).toHaveBeenCalledOnce();
  });
});
