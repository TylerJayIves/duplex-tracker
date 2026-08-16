import { requestMagicLink } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { HashErrorNotice } from "@/components/auth/HashErrorNotice";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Sign in
        </p>
        <h1 className="mt-1 text-2xl font-bold">The Duplex</h1>
      </div>

      <HashErrorNotice />

      {params.sent ? (
        <p className="border-l-4 border-moss bg-moss-soft p-3 text-sm text-ink">
          Check your email — we sent a link to sign in. It&apos;ll open right
          back up here.
        </p>
      ) : (
        <>
          {params.error && (
            <p className="border-l-4 border-brick bg-brick-soft p-3 text-sm text-ink">
              Something didn&apos;t go through. Enter your email below and
              we&apos;ll send a new link.
            </p>
          )}
          <form action={requestMagicLink} className="flex flex-col gap-3">
            <label
              htmlFor="email"
              className="font-mono text-xs tracking-wide text-ink-soft uppercase"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <Button type="submit">Send me a link</Button>
          </form>
        </>
      )}
    </div>
  );
}
