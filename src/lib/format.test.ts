import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { formatCents, formatDate, todayISO, daysUntil } from "./format";

describe("formatCents", () => {
  it("formats cents as dollars with a thousands separator", () => {
    expect(formatCents(199_900)).toBe("$1,999.00");
  });

  it("always shows two decimal places", () => {
    expect(formatCents(1_999)).toBe("$19.99");
    expect(formatCents(500)).toBe("$5.00");
  });

  it("formats amounts under a dollar", () => {
    expect(formatCents(5)).toBe("$0.05");
    expect(formatCents(0)).toBe("$0.00");
  });

  it("puts the minus sign before the dollar sign", () => {
    expect(formatCents(-500)).toBe("-$5.00");
  });
});

describe("formatDate", () => {
  it('shows "—" when there is no date', () => {
    expect(formatDate(null)).toBe("—");
  });

  it("formats a date as short month, day and year", () => {
    expect(formatDate("2026-10-14")).toBe("Oct 14, 2026");
  });

  it("does not shift a date-only string back a day in US time zones", () => {
    // "2026-01-01" is parsed as midnight UTC. Without timeZone: "UTC" in the formatter, a machine in Chicago would display it as Dec 31, 2025.
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });
});

describe("todayISO", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns today's date in Chicago as YYYY-MM-DD", () => {
    vi.setSystemTime(new Date("2026-10-15T17:00:00Z"));

    expect(todayISO()).toBe("2026-10-15");
  });

  it("is still the previous day at 10pm in Chicago, when UTC has already moved on", () => {
    vi.setSystemTime(new Date("2026-10-15T03:00:00Z")); // 10pm Oct 14 in Chicago

    expect(todayISO()).toBe("2026-10-14");
  });

  it("moves to the new day just after midnight in Chicago", () => {
    vi.setSystemTime(new Date("2026-10-15T05:30:00Z")); // 12:30am Oct 15 (CDT, UTC-5)

    expect(todayISO()).toBe("2026-10-15");
  });

  it("follows the winter offset once daylight saving ends", () => {
    // In January Chicago is UTC-6, so 05:30 UTC is still 11:30pm the day before.
    vi.setSystemTime(new Date("2027-01-15T05:30:00Z"));

    expect(todayISO()).toBe("2027-01-14");
  });
});

describe("daysUntil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T17:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for today", () => {
    expect(daysUntil("2026-10-15")).toBe(0);
  });

  it("returns a positive count for future dates", () => {
    expect(daysUntil("2026-10-16")).toBe(1);
    expect(daysUntil("2026-10-29")).toBe(14);
  });

  it("returns a negative count for past dates", () => {
    expect(daysUntil("2026-10-14")).toBe(-1);
    expect(daysUntil("2026-10-12")).toBe(-3);
  });

  it("counts from Chicago's date, not UTC's, late in the evening", () => {
    vi.setSystemTime(new Date("2026-10-15T03:00:00Z")); // 10pm Oct 14 in Chicago

    expect(daysUntil("2026-10-15")).toBe(1);
  });

  it("counts whole days across the end of daylight saving", () => {
    vi.setSystemTime(new Date("2026-10-31T17:00:00Z"));

    expect(daysUntil("2026-11-02")).toBe(2);
  });
});
