import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

// Simple signed upload endpoint: admin client uploads a base64 image, we push to Supabase Storage.
// Auth: caller must present a Supabase bearer token belonging to an admin user.
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        if (!auth.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = auth.slice(7);

        const body = await request.json().catch(() => null);
        const parsed = z.object({
          bucket: z.enum(["portfolio-images", "blog-images"]),
          filename: z.string().min(1).max(200),
          contentType: z.string().min(1),
          base64: z.string().min(1),
        }).safeParse(body);
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const { createClient } = await import("@supabase/supabase-js");
        const url = process.env.SUPABASE_URL!;
        const anon = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const userClient = createClient(url, anon, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined as any },
        });
        const { data: userData, error: uerr } = await userClient.auth.getUser(token);
        if (uerr || !userData?.user) return new Response("Unauthorized", { status: 401 });
        const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
        if (!isAdmin) return new Response("Forbidden", { status: 403 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const bytes = Buffer.from(parsed.data.base64, "base64");
        if (bytes.length > 10 * 1024 * 1024) return new Response("File too large", { status: 413 });
        const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${parsed.data.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const up = await supabaseAdmin.storage.from(parsed.data.bucket).upload(key, bytes, {
          contentType: parsed.data.contentType,
          upsert: false,
        });
        if (up.error) return new Response(up.error.message, { status: 500 });
        // Signed URL good for 10 years (private buckets)
        const signed = await supabaseAdmin.storage.from(parsed.data.bucket).createSignedUrl(key, 60 * 60 * 24 * 365 * 10);
        return Response.json({ path: key, url: signed.data?.signedUrl ?? null });
      },
    },
  },
});

// silence unused warnings from optional imports
void createHmac;
void timingSafeEqual;
