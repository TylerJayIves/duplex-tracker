"use client";

import { useActionState } from "react";
import { signIn, type FormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { FormError, inputClass, labelClass } from "./form-styles";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && <FormError>{state.error}</FormError>}
      <input type="hidden" name="next" value={next} />
      <label htmlFor="username" className={labelClass}>
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        required
        className={inputClass}
      />
      <label htmlFor="password" className={labelClass}>
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
