import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import PocketBase from "pocketbase";

// Preserves the exact contract ImageUpload.tsx already calls: POST
// {bucket, filename, contentType, base64} -> {path, url}. Only the backend
// changed — from a Supabase Storage signed-URL bucket to a `media`
// collection with a native PocketBase file field. Requires a new `media`
// collection: bucket (select: portfolio-images|blog-images), filename
// (text), file (file field). List/View rule public (""), Create/Update/
// Delete left unset (superuser-only via API) — see
// POCKETBASE-MIGRATION-PLAN.md.
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        if (!auth.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = auth.slice(7);

        const body = await request.json().catch(() => null);
        const parsed = z
          .object({
            bucket: z.enum(["portfolio-images", "blog-images"]),
            filename: z.string().min(1).max(200),
            contentType: z.string().min(1),
            base64: z.string().min(1),
          })
          .safeParse(body);
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const url = process.env["POCKETBASE_URL"];
        if (!url) return new Response("Server not configured", { status: 500 });

        // Verify the caller is a real admin_users session before doing
        // anything with the superuser client.
        const verifier = new PocketBase(url.replace(/\/+$/, ""));
        verifier.autoCancellation(false);
        verifier.authStore.save(token, null);
        try {
          await verifier.collection("admin_users").authRefresh();
        } catch {
          return new Response("Unauthorized", { status: 401 });
        }

        const bytes = Buffer.from(parsed.data.base64, "base64");
        if (bytes.length > 10 * 1024 * 1024) return new Response("File too large", { status: 413 });

        const safeName = parsed.data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fileBlob = new Blob([bytes], { type: parsed.data.contentType });

        const { getPbAdmin } = await import("@/integrations/pocketbase/client.server");
        const pbAdmin = await getPbAdmin();

        const formData = new FormData();
        formData.append("bucket", parsed.data.bucket);
        formData.append("filename", safeName);
        formData.append("file", fileBlob, safeName);

        try {
          const record = await pbAdmin.collection("media").create(formData);
          const fileUrl = pbAdmin.files.getURL(record, record["file"] as string);
          return Response.json({ path: record.id, url: fileUrl });
        } catch (err: any) {
          return new Response(err?.message ?? "Upload failed", { status: 500 });
        }
      },
    },
  },
});
