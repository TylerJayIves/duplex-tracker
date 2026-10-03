import Link from "next/link";
import { FunNav, FunTabBar } from "./FunNav";
import { FunThemeToggle } from "./FunThemeToggle";
import { Confetti } from "./Confetti";
import { LayoutSwitch } from "../LayoutSwitch";
import { getCurrentUser } from "@/lib/auth/current-user";
import { signOut } from "@/lib/actions/auth";

const chip =
  "fun-wiggle rounded-full border-2 border-ink bg-card px-3 py-1 text-xs font-bold text-ink shadow-[2px_2px_0_var(--fun-shadow)]";

/**
 * The "fun" alternative to AppShell. Pages and their components are shared
 * between both layouts; this shell plus the [data-layout="fun"] rules in
 * globals.css are everything that's different.
 */
export async function FunShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="fun-wiggle flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-10 place-content-center rounded-2xl border-2 border-ink bg-primary text-xl shadow-[2px_2px_0_var(--fun-shadow)]"
            >
              🏡
            </span>
            <span className="font-heading text-xl leading-none font-bold whitespace-nowrap text-ink">
              The Duplex
              {user && (
                <span className="block text-xs font-medium text-ink-soft">
                  Hey {user.name} 👋
                </span>
              )}
            </span>
          </Link>
          {user && <FunNav />}
          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link href="/account" className={chip}>
                  {user.name}
                </Link>
                {/* On phones these two live on the Account page instead. */}
                <LayoutSwitch to="classic" className={`${chip} hidden sm:block`}>
                  Classic
                </LayoutSwitch>
                <form action={signOut} className="hidden sm:block">
                  <button type="submit" className={chip}>
                    Sign out
                  </button>
                </form>
              </>
            )}
            <FunThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-28 sm:px-6 md:pb-12">
        {children}
      </main>
      {user && <FunTabBar />}
      <Confetti />
    </div>
  );
}
