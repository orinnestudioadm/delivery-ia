import { describe, expect, it } from "vitest";
import { formatCentsForInput, parsePriceToCents } from "../../src/lib/price";

describe("parsePriceToCents", () => {
  it("parses pt-BR decimals", () => {
    expect(parsePriceToCents("12,90")).toBe(1290);
    expect(parsePriceToCents("12,9")).toBe(1290);
  });

  it("parses dot decimals and integers", () => {
    expect(parsePriceToCents("12.90")).toBe(1290);
    expect(parsePriceToCents("15")).toBe(1500);
  });

  it("parses currency prefix and thousands separators", () => {
    expect(parsePriceToCents("R$ 1.299,90")).toBe(129990);
  });

  it("avoids floating point drift", () => {
    expect(parsePriceToCents("0,29")).toBe(29);
    expect(parsePriceToCents("1,15")).toBe(115);
  });

  it("rejects empty, zero, negative and non-numeric input", () => {
    expect(parsePriceToCents("")).toBeNull();
    expect(parsePriceToCents("   ")).toBeNull();
    expect(parsePriceToCents("0")).toBeNull();
    expect(parsePriceToCents("0,00")).toBeNull();
    expect(parsePriceToCents("-5")).toBeNull();
    expect(parsePriceToCents("abc")).toBeNull();
    expect(parsePriceToCents("12,999")).toBeNull();
  });
});

describe("formatCentsForInput", () => {
  it("formats cents as a pt-BR decimal string", () => {
    expect(formatCentsForInput(1290)).toBe("12,90");
    expect(formatCentsForInput(5)).toBe("0,05");
  });

  it("round-trips with parsePriceToCents", () => {
    expect(parsePriceToCents(formatCentsForInput(129990))).toBe(129990);
  });
});
