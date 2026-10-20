import { describe, expect, it } from "vitest";
import { signInMessage } from "./sign-in-message";

describe("signInMessage", () => {
  describe("known error codes", () => {
    it.each([
      ["invalid_credentials", "Wrong password."],
      [
        "email_not_confirmed",
        "This account's email isn't marked as confirmed in Supabase yet.",
      ],
      [
        "email_provider_disabled",
        "Password sign-in is turned off in Supabase (Email provider).",
      ],
      [
        "provider_disabled",
        "Password sign-in is turned off in Supabase (Email provider).",
      ],
      ["user_banned", "This account is blocked in Supabase."],
      [
        "captcha_failed",
        "Supabase has captcha turned on, which this sign-in form doesn't support.",
      ],
    ])("maps %s to its message", (code, message) => {
      expect(signInMessage(code, 400)).toBe(message);
    });
  });
  describe("status fallbacks", () => {
    it.each([0, undefined])(
      "says Supabase is unreachable when status is %s",
      (status) => {
        expect(signInMessage("unknown_code", status)).toBe(
          "Couldn't reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL for this deployment.",
        );
      },
    );

    it("says to wait when rate limited (429)", () => {
      expect(signInMessage("unknown_code", 429)).toBe(
        "Too many attempts. Wait a few minutes, then try again.",
      );
    });

    it("uses a known code message even when the status is 429", () => {
      expect(signInMessage("invalid_credentials", 429)).toBe("Wrong password.");
    });

    it("shows the code in the generic message when it's unrecognized", () => {
      expect(signInMessage("unknown_code", 500)).toBe(
        "Sign-in failed (unknown_code). Try again.",
      );
    });

    it("shows the status in the generic message when there is not a code", () => {
      expect(signInMessage(undefined, 500)).toBe(
        "Sign-in failed (500). Try again.",
      );
    });
  });
});
