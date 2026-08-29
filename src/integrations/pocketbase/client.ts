// Replaces src/integrations/supabase/client.ts.
// This is web-main's OWN dedicated PocketBase instance — separate from the
// one serving synkra-client-hub. Do not point this at pb.synkra.co.za.
//
// Auth collection: `admin_users`. Every record in this collection is an
// admin (no separate roles/user_roles table — see POCKETBASE-MIGRATION-PLAN.md).
import PocketBase from "pocketbase";

export const DEFAULT_POCKETBASE_URL = "http://127.0.0.1:8090";

function resolveUrl(): string {
  const configured = (
    (import.meta.env?.["VITE_POCKETBASE_URL"] as string | undefined) ??
    (typeof process !== "undefined" ? process.env?.["VITE_POCKETBASE_URL"] : undefined)
  )?.trim();
  if (configured && /^https?:\/\//.test(configured)) {
    return configured.replace(/\/+$/, "");
  }
  console.warn(
    `[Synkra] VITE_POCKETBASE_URL is not set. Falling back to ${DEFAULT_POCKETBASE_URL}. ` +
      "Set it as a build argument in Coolify.",
  );
  return DEFAULT_POCKETBASE_URL;
}

export const POCKETBASE_URL = resolveUrl();

// Import like: import { pb } from "@/integrations/pocketbase/client";
export const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

/** True when the failure never reached PocketBase (DNS, TLS, CORS, offline). */
export function isNetworkFailure(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; isAbort?: boolean; message?: string };
  if (e.isAbort) return false;
  if (e.status === 0) return true;
  return /failed to fetch|networkerror|load failed|fetch failed/i.test(e.message ?? "");
}

export default pb;
