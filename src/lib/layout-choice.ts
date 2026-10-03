import "server-only";
import { cookies } from "next/headers";

export type LayoutChoice = "classic" | "fun";

export const LAYOUT_COOKIE = "layout";

/**
 * Which look this browser asked for. Stored in a cookie rather than the
 * database so it's a per-device preference (each phone keeps its own) and
 * needs no migration. Anything unexpected falls back to the classic look.
 */
export async function getLayoutChoice(): Promise<LayoutChoice> {
  const value = (await cookies()).get(LAYOUT_COOKIE)?.value;
  return value === "fun" ? "fun" : "classic";
}
