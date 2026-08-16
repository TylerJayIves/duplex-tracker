"use client";

import { useEffect, useState } from "react";

/**
 * GoTrue can redirect an expired/invalid magic link back to the site with the
 * error in the URL *hash fragment* (`#error=...`), which the server never
 * sees -- this catches that case client-side after mount.
 */
export function HashErrorNotice() {
  const [hasHashError, setHasHashError] = useState(false);

  // One-time check of the URL fragment on mount, not a sync with external
  // state that changes -- the same justified case as ThemeToggle's mount flag.
  useEffect(() => {
    if (window.location.hash.includes("error")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasHashError(true);
    }
  }, []);

  if (!hasHashError) return null;

  return (
    <p className="border-l-4 border-brick bg-brick-soft p-3 text-sm text-ink">
      Something didn&apos;t go through. Enter your email below and we&apos;ll
      send a new link.
    </p>
  );
}
