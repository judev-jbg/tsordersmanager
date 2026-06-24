import { describe, expect, it } from "vitest";
import { formatPostalCode, formatRecipient, normalizePhone } from "./orderDisplay";

describe("order display helpers", () => {
  it("removes the purchase order prefix from a recipient", () => {
    expect(formatRecipient("Ana POREF-1", "REF-1")).toBe("Ana ");
  });

  it("normalizes Spanish phone prefixes and separators", () => {
    expect(normalizePhone("+34-600 000.0")).toBe("600000");
    expect(normalizePhone("")).toBe("");
  });

  it("pads four-digit postal codes", () => {
    expect(formatPostalCode("8001")).toBe("08001");
    expect(formatPostalCode("28001")).toBe("28001");
  });
});
