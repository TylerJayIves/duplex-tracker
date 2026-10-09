/**
 * Parses a user-typed dollar amount into integer cents. Never uses float
 * multiplication (naive `parseFloat(v) * 100` can misfire on certain
 * decimals) -- whole/fraction are parsed as integer strings and combined.
 * Returns null for anything that isn't a valid non-negative amount with at
 * most 2 decimal places.
 */
export function parseCentsInput(raw: string): number | null {
  const trimmed = raw.trim().replace(/\$/g, "");
  if (trimmed === "") return null;

  const match = /^(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d{0,2}))?$/.exec(trimmed);
  if (!match) return null;

  const [, wholePart, fractionPart = ""] = match;
  const wholeDigits = wholePart.replace(/,/g, ""); // Remove Commas after input match has taken place TI 09/10/26
  const cents = fractionPart.padEnd(2, "0");
  const totalCents = Number(wholeDigits) * 100 + Number(cents);

  return Number.isSafeInteger(totalCents) ? totalCents : null;
}

/**
 * Inverse of parseCentsInput, for pre-filling an editable input's default
 * value -- a plain decimal string with no "$" or thousands separator, so it
 * round-trips through parseCentsInput. Distinct from formatCents (display
 * only, e.g. "$1,999.00").
 */
export function centsToInputValue(cents: number | null): string {
  if (cents === null) return "";
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const whole = Math.trunc(abs / 100);
  const fraction = String(abs % 100).padStart(2, "0");
  return `${sign}${whole}.${fraction}`;
}
