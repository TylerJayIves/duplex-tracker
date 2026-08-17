import type { ProjectColor } from "./data/types";

// Single source of truth for the Tailwind classes tied to each color, so
// every literal string Tailwind's scanner needs to see lives in one place
// instead of being retyped (and risking a typo) at each call site.
export const PROJECT_COLORS: {
  value: ProjectColor;
  label: string;
  swatch: string;
  borderLeft: string;
  dot: string;
}[] = [
  { value: "indigo", label: "Indigo", swatch: "bg-project-indigo", borderLeft: "border-l-project-indigo", dot: "bg-project-indigo" },
  { value: "plum", label: "Plum", swatch: "bg-project-plum", borderLeft: "border-l-project-plum", dot: "bg-project-plum" },
  { value: "rose", label: "Rose", swatch: "bg-project-rose", borderLeft: "border-l-project-rose", dot: "bg-project-rose" },
  { value: "slate", label: "Slate", swatch: "bg-project-slate", borderLeft: "border-l-project-slate", dot: "bg-project-slate" },
  { value: "mustard", label: "Mustard", swatch: "bg-project-mustard", borderLeft: "border-l-project-mustard", dot: "bg-project-mustard" },
  { value: "denim", label: "Denim", swatch: "bg-project-denim", borderLeft: "border-l-project-denim", dot: "bg-project-denim" },
];

const BY_VALUE = new Map(PROJECT_COLORS.map((c) => [c.value, c]));

export function projectColorConfig(color: ProjectColor | null) {
  return color ? (BY_VALUE.get(color) ?? null) : null;
}
