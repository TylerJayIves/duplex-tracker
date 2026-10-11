import { describe, it, expect } from "vitest";
import { parseCentsInput, centsToInputValue } from "./money";

describe("parseCentsInput", () => {
  describe("whole dollars", () => {
    it("converts whole dollars to cents", () => {
      const raw = "5005";

      const result = parseCentsInput(raw);

      expect(result).toBe(500500);
    });

    it("ignores a leading dollar sign", () => {
      const raw = "$100";

      const result = parseCentsInput(raw);

      expect(result).toBe(10000);
    });
  });

  describe("decimals", () => {
    it("converts two decimal places to cents", () => {
      const raw = "110.99";

      const result = parseCentsInput(raw);

      expect(result).toBe(11099);
    });

    it("treats a single decimal digit as tens of cents", () => {
      const raw = "12.5";

      const result = parseCentsInput(raw);

      expect(result).toBe(1250);
    });

    it("accepts a trailing decimal point with no digits after it", () => {
      const raw = "12.";

      const result = parseCentsInput(raw);

      expect(result).toBe(1200);
    });

    it("returns null for more than two decimal places", () => {
      const raw = "1.234";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });
  });

  describe("commas", () => {
    it("accepts a single thousands separator", () => {
      const raw = "1,250";

      const result = parseCentsInput(raw);

      expect(result).toBe(125000);
    });

    it("accepts multiple thousands separators with decimals", () => {
      const raw = "1,250,000.50";

      const result = parseCentsInput(raw);

      expect(result).toBe(125000050);
    });

    it("returns null for commas in invalid positions", () => {
      const raw = "1,0,0";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for an ambiguous comma, such as 12,50", () => {
      // Could mean $1,250 or a European-style $12.50, so refuse to guess.
      const raw = "12,50";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for a leading comma", () => {
      const raw = ",250";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });
  });

  describe("whitespace", () => {
    it("ignores spaces before and after the number", () => {
      const raw = "  12  ";

      const result = parseCentsInput(raw);

      expect(result).toBe(1200);
    });

    it("returns null for spaces inside the number", () => {
      const raw = "100  200 300";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });
  });

  describe("invalid input", () => {
    it("returns null for an empty string", () => {
      const raw = "";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for a string of only spaces", () => {
      const raw = "   ";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for text", () => {
      const raw = "Thisisntanumber";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for symbols", () => {
      const raw = "!@#$%^&*()_+";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });

    it("returns null for negative amounts", () => {
      const raw = "-50";

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });
  });

  describe("safe integer limit", () => {
    // The largest whole-dollar amount whose value in cents still fits
    // within Number.MAX_SAFE_INTEGER.
    const maxSafeDollars = Math.floor(Number.MAX_SAFE_INTEGER / 100);

    it("parses the largest whole-dollar amount within the safe limit", () => {
      const raw = maxSafeDollars.toString();

      const result = parseCentsInput(raw);

      expect(result).toBe(maxSafeDollars * 100);
    });

    it("returns null for one dollar past the safe limit", () => {
      const raw = (maxSafeDollars + 1).toString();

      const result = parseCentsInput(raw);

      expect(result).toBeNull();
    });
  });
});

describe("centsToInputValue", () => {
  it("formats cents as a plain decimal dollar string", () => {
    const raw = 32500;

    const result = centsToInputValue(raw);

    expect(result).toBe("325.00");
  });

  it("returns negative dollar amount if negative data is provided", () => {
    const raw = -500;

    const result = centsToInputValue(raw);

    expect(result).toBe("-5.00");
  });

  it("returns empty string when cents is null", () => {
    const raw = null;

    const result = centsToInputValue(raw);

    expect(result).toBe("");
  });

  it("formats small negative amounts with a leading zero", () => {
    const raw = -5;

    const result = centsToInputValue(raw);

    expect(result).toBe("-0.05");
  });

  it("returns accurate data by padding single-digit cents with a leading zero", () => {
    const raw = 5;

    const result = centsToInputValue(raw);

    expect(result).toBe("0.05");
  });

  it.each([0, 5, 99, 1999, 125_000_000])("round-trips %i cents", (cents) => {
    const asString = centsToInputValue(cents);

    const backToCents = parseCentsInput(asString);

    expect(backToCents).toBe(cents);
  });
});
