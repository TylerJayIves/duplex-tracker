"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "border-l-2 px-3 py-2 font-mono text-sm tracking-wide transition-colors",
        active
          ? "border-primary bg-accent text-ink"
          : "border-transparent text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}
