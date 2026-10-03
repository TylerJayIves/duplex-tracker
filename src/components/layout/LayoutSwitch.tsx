import { setLayoutChoice } from "@/lib/actions/layout";
import type { LayoutChoice } from "@/lib/layout-choice";

/** A one-button form that flips this browser to the other layout. */
export function LayoutSwitch({
  to,
  className,
  children,
}: {
  to: LayoutChoice;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={setLayoutChoice.bind(null, to)}>
      <button type="submit" className={className} title={`Switch to the ${to} layout`}>
        {children}
      </button>
    </form>
  );
}
