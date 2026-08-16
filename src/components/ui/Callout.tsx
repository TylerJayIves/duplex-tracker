import { cn } from "@/lib/utils";

type CalloutTone = "accent" | "moss" | "amber" | "brick";

const TONE_CLASSES: Record<CalloutTone, string> = {
  accent: "border-primary bg-accent",
  moss: "border-moss bg-moss-soft",
  amber: "border-amber bg-amber-soft",
  brick: "border-brick bg-brick-soft",
};

const EYEBROW_CLASSES: Record<CalloutTone, string> = {
  accent: "text-primary",
  moss: "text-moss",
  amber: "text-amber",
  brick: "text-brick",
};

export function Callout({
  tone = "accent",
  eyebrow,
  title,
  children,
  className,
}: {
  tone?: CalloutTone;
  eyebrow?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-l-4 p-4", TONE_CLASSES[tone], className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-1 font-mono text-[0.68rem] tracking-wide uppercase",
            EYEBROW_CLASSES[tone]
          )}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <p className="font-heading text-base font-semibold text-ink">
          {title}
        </p>
      )}
      {children && (
        <div className="mt-1 text-sm text-ink-soft">{children}</div>
      )}
    </div>
  );
}
