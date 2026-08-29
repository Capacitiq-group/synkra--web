// Replaces src/integrations/supabase/client.server.ts.
// Server-side PocketBase client authenticated as a superuser — bypasses all
// collection API rules. Use only for trusted server-side operations
// (inviteAdmin, removeAdmin, media uploads) — never expose to client code.
//
// Load inside server handlers only:
//   const { pbAdmin } = await import("@/integrations/pocketbase/client.server");
import PocketBase from "pocketbase";

function serverUrl(): string {
  const url = process.env["POCKETBASE_URL"];
  if (!url) {
    throw new Error(
      "Missing POCKETBASE_URL environment variable. Set it in Coolify's Environment Variables.",
    );
  }
  return url.replace(/\/+$/, "");
}

let _pbAdmin: PocketBase | undefined;
let _authPromise: Promise<void> | undefined;

async function ensureAuth(client: PocketBase): Promise<void> {
  if (client.authStore.isValid) return;
  const email = process.env["POCKETBASE_ADMIN_EMAIL"];
  const password = process.env["POCKETBASE_ADMIN_PASSWORD"];
  if (!email || !password) {
    throw new Error(
      "Missing POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD environment variables.",
    );
  }
  await client.collection("_superusers").authWithPassword(email, password);
}

/**
 * Lazily-authenticated superuser PocketBase client. Re-authenticates
 * automatically once the token nears expiry (PocketBase superuser tokens
 * are short-lived) — callers don't need to think about token refresh.
 */
export async function getPbAdmin(): Promise<PocketBase> {
  if (!_pbAdmin) {
    _pbAdmin = new PocketBase(serverUrl());
    _pbAdmin.autoCancellation(false);
  }
  if (!_authPromise) {
    _authPromise = ensureAuth(_pbAdmin).catch((err) => {
      _authPromise = undefined; // allow retry on next call
      throw err;
    });
  }
  await _authPromise;
  return _pbAdmin;
}
