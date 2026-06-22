import { describe, expect, it } from "vitest";
import { ORDER_TABLE_COLUMNS } from "./orderTableColumns";

describe("order table columns", () => {
  it("defines editable observation and refC columns", () => {
    expect(ORDER_TABLE_COLUMNS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "observaciones", editable: true, maxLength: 98 }),
        expect.objectContaining({ id: "refC", editable: true, maxLength: 14 }),
      ])
    );
  });

  it("keeps read-only service and schedule columns", () => {
    expect(ORDER_TABLE_COLUMNS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "servicio", editable: false }),
        expect.objectContaining({ id: "horario", editable: false }),
      ])
    );
  });
});
