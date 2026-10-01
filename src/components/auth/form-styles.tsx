export const inputClass =
  "border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
export const labelClass = "font-mono text-xs tracking-wide text-ink-soft uppercase";

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="border-l-4 border-brick bg-brick-soft p-3 text-sm text-ink">
      {children}
    </p>
  );
}
