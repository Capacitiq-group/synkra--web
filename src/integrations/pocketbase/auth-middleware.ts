// Replaces src/integrations/supabase/auth-middleware.ts.
// Validates the caller's PocketBase auth token (from admin_users) on every
// request. A successful authRefresh() both validates the token AND returns
// the current record in one call — no separate role check needed, since
// every record in `admin_users` is by definition an admin.
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import PocketBase from "pocketbase";

function serverUrl(): string {
  const url = process.env["POCKETBASE_URL"];
  if (!url) throw new Error("Missing POCKETBASE_URL environment variable.");
  return url.replace(/\/+$/, "");
}

export const requireAdminAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }
    const token = authHeader.slice(7);
    if (!token) throw new Error("Unauthorized: No token provided");

    const pb = new PocketBase(serverUrl());
    pb.autoCancellation(false);
    pb.authStore.save(token, null);

    let record;
    try {
      const result = await pb.collection("admin_users").authRefresh();
      record = result.record;
    } catch {
      throw new Error("Unauthorized: Invalid or expired token");
    }

    return next({
      context: {
        pb,
        userId: record.id,
        email: (record["email"] as string | undefined) ?? "",
      },
    });
  },
);
