"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FUN_NAV_ITEMS } from "./nav-items";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** Pill-shaped tabs in the header; hidden on phones in favour of FunTabBar. */
export function FunNav() {
  const isActive = useIsActive();
  return (
    <nav className="hidden items-center gap-1.5 md:flex">
      {FUN_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "fun-wiggle flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition-colors",
            isActive(item.href)
              ? "border-ink bg-accent text-ink shadow-[2px_2px_0_var(--fun-shadow)]"
              : "border-transparent text-ink-soft hover:bg-accent/60 hover:text-ink"
          )}
        >
          <span aria-hidden>{item.emoji}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Thumb-reachable tab bar pinned to the bottom of the screen on phones. */
export function FunTabBar() {
  const isActive = useIsActive();
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-3xl border-2 border-ink bg-card px-1 py-1.5 shadow-[3px_3px_0_var(--fun-shadow)] md:hidden">
      {FUN_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1 text-[0.68rem] font-bold",
            isActive(item.href) ? "bg-accent text-ink" : "text-ink-soft"
          )}
        >
          <span aria-hidden className="text-xl leading-none">
            {item.emoji}
          </span>
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
