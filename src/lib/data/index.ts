import "server-only";
import type { DataClient } from "./client";
import { supabaseClient } from "./supabase/supabase-client";
import { isDemo } from "@/lib/demo";
import { mockClient } from "./mock/mock-client";
// The demo deployment uses the in-memory mock client; every screen calls
// dataClient through the same interface, so this is the
// only line that changes.
export const dataClient: DataClient = isDemo ? mockClient : supabaseClient;
