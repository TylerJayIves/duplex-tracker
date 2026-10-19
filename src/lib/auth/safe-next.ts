/**
 * Only same-site paths -- `next` comes from the URL, so anything like
 * `//evil.com` or `https://...` must not become a redirect target.
 */
export function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value ?? "");
  return next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
    ? next
    : "/";
}
