import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function Thead(props: React.ComponentProps<"thead">) {
  return (
    <thead
      className="border-b border-border text-left font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase"
      {...props}
    />
  );
}

export function Tbody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr className={cn("border-b border-border last:border-0", className)} {...props} />
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("py-2 pr-4 font-medium", className)} {...props} />;
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("py-2 pr-4", className)} {...props} />;
}
