import "server-only";
import type { DataClient } from "./client";
import { supabaseClient } from "./supabase/supabase-client";

// Was `mockClient` from ./mock/mock-client through Milestone 1 — every
// screen calls `dataClient` through the same interface, so that was the
// only line that needed to change.
export const dataClient: DataClient = supabaseClient;
