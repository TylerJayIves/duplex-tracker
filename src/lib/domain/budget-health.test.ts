import { describe, it, expect } from "vitest";
import { getBudgetHealth } from "./budget-health";

describe("getBudgetHealth", () => {
  it("is 'good' when well under the limit", () => {
    // Arrange: a $1,000 budget with $500 spent (values are in cents)
    const limit = 100_000;
    const spent = 50_000;

    // Act
    const result = getBudgetHealth(limit, spent);

    // Assert
    expect(result.level).toBe("good");
    expect(result.pct).toBe(50);
    expect(result.remainingCents).toBe(50_000);
  });

  it("is 'critical' when over the limit", () => {
    const limit = 5_000_000;
    const spent = 10_000_000;

    const result = getBudgetHealth(limit, spent);

    expect(result.level).toBe("critical");
    expect(result.pct).toBe(200);
    expect(result.remainingCents).toBe(-5_000_000);
  });

  it("is 'attention' when budget is exactly on the limit", () => {
    const limit = 500;
    const spent = 500;

    const result = getBudgetHealth(limit, spent);

    expect(result.level).toBe("attention");
    expect(result.pct).toBe(100);
    expect(result.remainingCents).toBe(0);
  });

  it("should be good at around 84%", () => {
    const limit = 1_000;
    const spent = 848;

    const result = getBudgetHealth(limit, spent);

    expect(result.level).toBe("good");
    expect(result.pct).toBeCloseTo(84.8);
    expect(result.remainingCents).toBe(152);
  });

  it("should be good at 0", () => {
    const limit = 0;
    const spent = 0;

    const result = getBudgetHealth(limit, spent);

    expect(result.level).toBe("good");
  });
});
