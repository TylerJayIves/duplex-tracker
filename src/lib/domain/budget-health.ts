export type BudgetHealthLevel = "good" | "attention" | "critical";

export interface BudgetHealth {
  level: BudgetHealthLevel;
  pct: number; // 0-100+, committed spend as a percentage of the limit
  remainingCents: number; // can be negative when over
}

const ATTENTION_THRESHOLD = 0.85;

export function getBudgetHealth(
  limitCents: number,
  committedCents: number
): BudgetHealth {
  const pct = limitCents === 0 ? 0 : (committedCents / limitCents) * 100;
  const level: BudgetHealthLevel =
    committedCents > limitCents
      ? "critical"
      : pct / 100 >= ATTENTION_THRESHOLD
        ? "attention"
        : "good";

  return {
    level,
    pct,
    remainingCents: limitCents - committedCents,
  };
}
