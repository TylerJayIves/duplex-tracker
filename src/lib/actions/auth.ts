"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "../auth/safe-next";
import { signInMessage } from "../auth/sign-in-message";
export type FormState = { error?: string; ok?: boolean };

/**
 * Username + password, no email involved. Supabase still keys accounts by
 * email, so a username is first mapped to its account's email through the
 * `email_for_username` lookup. Typing the email itself also works.
 */
export async function signIn(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const login = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!login || !password)
    return { error: "Enter your username and password." };

  const supabase = await createClient();

  let email = login;
  if (!login.includes("@")) {
    const { data, error } = await supabase.rpc("email_for_username", {
      p_username: login,
    });
    if (error) {
      // Most likely the username_login migration hasn't been applied.
      return {
        error: "Usernames aren't set up yet. Sign in with your email instead.",
      };
    }
    if (!data) return { error: `No account has the username "${login}".` };
    email = data;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Logged so the real cause shows up in the server logs.
    console.error(
      "signInWithPassword failed",
      error.status,
      error.code,
      error.message,
    );
    return { error: signInMessage(error.code, error.status) };
  }

  redirect(next);
}

export async function changePassword(
  prev: FormState,
  formData: FormData,
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
