"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LAYOUT_COOKIE, type LayoutChoice } from "@/lib/layout-choice";

export async function setLayoutChoice(choice: LayoutChoice) {
  (await cookies()).set(LAYOUT_COOKIE, choice === "fun" ? "fun" : "classic", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  // The root layout reads the cookie, so re-render everything under it.
  revalidatePath("/", "layout");
}
