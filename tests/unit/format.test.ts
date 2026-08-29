import { describe, expect, it } from "vitest";
import { formatCurrency } from "../../src/lib/format";

// Intl.NumberFormat inserts a non-breaking space between "R$" and the
// amount, so we normalize whitespace before comparing.
const normalize = (value: string) => value.replace(/\s/g, " ");

describe("formatCurrency", () => {
  it("formats cents as BRL currency", () => {
    expect(normalize(formatCurrency(12990))).toBe("R$ 129,90");
  });

  it("formats zero", () => {
    expect(normalize(formatCurrency(0))).toBe("R$ 0,00");
  });
});
