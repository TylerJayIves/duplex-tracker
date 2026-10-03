import { PageHeader } from "@/components/layout/PageHeader";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { LayoutSwitch } from "@/components/layout/LayoutSwitch";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getLayoutChoice } from "@/lib/layout-choice";
import { signOut } from "@/lib/actions/auth";

const buttonClass =
  "border border-border px-3 py-1.5 font-mono text-xs tracking-wide text-ink-soft uppercase hover:text-ink";

export default async function AccountPage() {
  const [user, layout] = await Promise.all([getCurrentUser(), getLayoutChoice()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title={user ? user.name : "Your account"}
        description="Change the password you sign in with."
      />
      <div className="max-w-sm">
        <ChangePasswordForm />
      </div>
      <section className="max-w-sm space-y-2">
        <h2 className="text-lg font-semibold">Layout</h2>
        <p className="text-sm text-ink-soft">
          You&apos;re using the {layout} layout on this device. Each phone or browser
          remembers its own choice.
        </p>
        <div className="flex flex-wrap gap-2">
          <LayoutSwitch to={layout === "fun" ? "classic" : "fun"} className={buttonClass}>
            Switch to {layout === "fun" ? "classic" : "fun"}
          </LayoutSwitch>
          <form action={signOut}>
            <button type="submit" className={buttonClass}>
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
