export function rupiah(n: bigint | number | string): string {
  const num = Number(n);
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function priceToNumber(str: string): number {
  return Number((str || "").replace(/[^0-9]/g, "") || "0");
}

export function priceToShort(n: bigint | number): string {
  const val = Number(n);
  if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(val % 1_000_000_000 === 0 ? 0 : 2)} Miliar`;
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 2)} Juta`;
  if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)} Ribu`;
  return rupiah(val);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
