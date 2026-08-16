import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="space-y-3 py-16 text-center">
      <p className="font-mono text-xs tracking-wide text-brick uppercase">404</p>
      <h1 className="text-2xl font-bold">Project not found</h1>
      <p className="text-sm text-ink-soft">
        It may have been removed, or the link is off.
      </p>
      <Link href="/projects" className="text-sm text-primary hover:underline">
        Back to all projects
      </Link>
    </div>
  );
}
