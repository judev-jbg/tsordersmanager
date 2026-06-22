import { describe, expect, it } from "vitest";
import { validateOrderTableValue } from "./orderTableRules";

describe("order table rules", () => {
  it.each(["refC", "observaciones"])("accepts an empty %s value", (column) => {
    expect(validateOrderTableValue(column, "")).toBe(true);
  });

  it("validates phone and mobile characters", () => {
    expect(validateOrderTableValue("telefono", "+34 600-000")).toBe(true);
    expect(validateOrderTableValue("movil", "600abc")).toBe(false);
  });

  it("accepts international postal code characters", () => {
    expect(validateOrderTableValue("cp", "SW1A-1AA")).toBe(true);
    expect(validateOrderTableValue("cp", "28001!")).toBe(false);
  });

  it("rejects values exceeding the configured limit", () => {
    expect(validateOrderTableValue("refC", "123456789012345")).toBe(false);
  });

  it("accepts an unrestricted column value", () => {
    expect(validateOrderTableValue("unknown", "any value")).toBe(true);
  });
});
