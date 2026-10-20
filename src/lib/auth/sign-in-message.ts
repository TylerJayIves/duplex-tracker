/** Separate messages per cause, so a setup problem doesn't look like a typo. */
export function signInMessage(
  code: string | undefined,
  status: number | undefined,
): string {
  switch (code) {
    case "invalid_credentials":
      return "Wrong password.";
    case "email_not_confirmed":
      return "This account's email isn't marked as confirmed in Supabase yet.";
    case "email_provider_disabled":
    case "provider_disabled":
      return "Password sign-in is turned off in Supabase (Email provider).";
    case "user_banned":
      return "This account is blocked in Supabase.";
    case "captcha_failed":
      return "Supabase has captcha turned on, which this sign-in form doesn't support.";
  }
  // supabase-js reports status 0 when the request never got an answer.
  if (!status)
    return "Couldn't reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL for this deployment.";
  if (status === 429)
    return "Too many attempts. Wait a few minutes, then try again.";
  return `Sign-in failed (${code ?? status ?? "unknown error"}). Try again.`;
}
