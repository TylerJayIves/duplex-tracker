import { describe, it, expect } from "vitest";
import { parseCentsInput } from "./money";

describe("Non-numerical inputs", () => {
  it("ignores an entirely non-numerical text inputs and returns null", () => {
    const raw = "Thisisntanumber";

    const result = parseCentsInput(raw);

    expect(result).toBeNull();
  });

  it("function converts dollars to cents", () => {
    const raw = "5005";

    const result = parseCentsInput(raw);

    expect(result).toBe(500500);
  });

  it("correctly returns 'null' when provided nonsense symbol input", () => {
    const raw = "!@#$%^&*()_+";

    const result = parseCentsInput(raw);

    expect(result).toBeNull();
  });

  it("correctly returns the dollar amount of the input contains $", () => {
    const raw = "$100";

    const result = parseCentsInput(raw);

    expect(result).toBe(10000);
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

  it("handles very high numbers, within safe limits", () => {
    const raw = "9999999999999";

    const result = parseCentsInput(raw);

    expect(result).toBe(999999999999900);
  });

  it("handles decimal input as the desired cents", () => {
    const raw = "110.99";

    const result = parseCentsInput(raw);

    expect(result).toBe(11099);
  });

  it("returns null for a space inside the number", () => {
    const raw = "100  200 300";

    const result = parseCentsInput(raw);

    expect(result).toBeNull();
  });

  it("deals with multiple decibels", () => {
    const raw = "1,20,3";

    const result = parseCentsInput(raw);

    expect(result).toBeNull();
  });
});
