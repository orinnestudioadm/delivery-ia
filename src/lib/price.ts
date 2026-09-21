// Converts a price typed in reais ("12,90", "12.90", "R$ 1.299,90") into
// integer cents. Returns null for empty, non-numeric, zero or negative values.
export function parsePriceToCents(input: string): number | null {
  const cleaned = input.replace(/R\$|\s/g, "");
  if (cleaned === "") {
    return null;
  }

  // pt-BR: "." groups thousands and "," is the decimal separator.
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const cents = Math.round(Number(normalized) * 100);
  return cents > 0 ? cents : null;
}

// Inverse of parsePriceToCents, for pre-filling the edit form ("12,90").
export function formatCentsForInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}
