import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  // The action re-checks this; it's only passed through the form.
  const next = params.next?.startsWith("/") ? params.next : "/";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Sign in
        </p>
        <h1 className="mt-1 text-2xl font-bold">The 3250 Duplex</h1>
      </div>
      <LoginForm next={next} />
    </div>
  );
}
