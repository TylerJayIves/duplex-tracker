"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: boolean };

/**
 * Only same-site paths -- `next` comes from the URL, so anything like
 * `//evil.com` or `https://...` must not become a redirect target.
 */
function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/";
}

/** Separate messages per cause, so a setup problem doesn't look like a typo. */
function signInMessage(code: string | undefined, status: number | undefined): string {
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
  if (status === 429) return "Too many attempts. Wait a few minutes, then try again.";
  return `Sign-in failed (${code ?? status ?? "unknown error"}). Try again.`;
}

/**
 * Username + password, no email involved. Supabase still keys accounts by
 * email, so a username is first mapped to its account's email through the
 * `email_for_username` lookup. Typing the email itself also works.
 */
export async function signIn(prev: FormState, formData: FormData): Promise<FormState> {
  const login = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!login || !password) return { error: "Enter your username and password." };

  const supabase = await createClient();

  let email = login;
  if (!login.includes("@")) {
    const { data, error } = await supabase.rpc("email_for_username", {
      p_username: login,
    });
    if (error) {
      // Most likely the username_login migration hasn't been applied.
      return { error: "Usernames aren't set up yet. Sign in with your email instead." };
    }
    if (!data) return { error: `No account has the username "${login}".` };
    email = data;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Logged so the real cause shows up in the server logs.
    console.error("signInWithPassword failed", error.status, error.code, error.message);
    return { error: signInMessage(error.code, error.status) };
  }

  redirect(next);
}

export async function changePassword(
  prev: FormState,
  formData: FormData
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "That's already your password."
          : "Couldn't change your password. Try again.",
    };
  }
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
