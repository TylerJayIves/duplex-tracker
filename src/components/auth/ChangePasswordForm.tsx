"use client";

import { useActionState } from "react";
import { changePassword, type FormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { FormError, inputClass, labelClass } from "./form-styles";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    changePassword,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && <FormError>{state.error}</FormError>}
      {state.ok && (
        <p role="status" className="border-l-4 border-moss bg-moss-soft p-3 text-sm text-ink">
          Password changed. Use the new one next time you sign in.
        </p>
      )}
      <label htmlFor="password" className={labelClass}>
        New password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className={inputClass}
      />
      <label htmlFor="confirm" className={labelClass}>
        Type it again
      </label>
      <input
        id="confirm"
        name="confirm"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className={inputClass}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}
