import Link from "next/link";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { getCurrentUser } from "@/lib/auth/current-user";
import { signOut } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/contractors", label: "Contractors" },
  { href: "/budgets", label: "Budgets" },
  { href: "/timeline", label: "Timeline" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="font-heading text-lg font-bold text-ink">
            The Duplex
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user && (
              <form action={signOut} className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink-soft">
                  {user.name}
                </span>
                <button
                  type="submit"
                  className="border border-border px-2 py-1 font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
