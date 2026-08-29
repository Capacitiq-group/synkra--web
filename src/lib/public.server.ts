import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-side publishable Supabase client for public reads.
 * Returns null when env is unavailable so callers can degrade gracefully
 * instead of crashing the whole page.
 */
export function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    console.error("[public] Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY");
    return null;
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}
