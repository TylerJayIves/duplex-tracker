const DUMMY_ORIGIN = "https://x";

/**
 * Only same-site paths -- `next` comes from the URL, so it must not become
 * a redirect to another site. Rather than guessing at tricks (`//evil.com`,
 * `/\evil.com`, hidden tabs), let the URL parser resolve it and reject
 * anything that lands on a different origin.
 */

export function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value ?? "");
  if (!next.startsWith("/")) return "/";

  try {
    const url = new URL(next, DUMMY_ORIGIN);

    if (url.origin !== DUMMY_ORIGIN) return "/";

    return next;
  } catch {
    return "/";
  }
}
