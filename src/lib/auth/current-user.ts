import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@/lib/data/types";
import { isDemo } from "../demo";
import { users } from "@/lib/data/mock/seed";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (isDemo) {
    return users[0];
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("id, email, name")
    .eq("id", user.id)
    .single();

  return data ? { id: data.id, name: data.name, email: data.email } : null;
});
