// Public form submission endpoint for Synkra.
// All site forms POST JSON here; submissions are written to the
// `form_submissions` collection in PocketBase.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import PocketBase from "pocketbase";

const SubmitSchema = z.object({
  form_type: z.string().min(1).max(64),
  name: z.string().max(200).optional(),
  email: z.string().email().max(200).optional(),
  phone: z.string().max(64).optional(),
  company: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  payload: z.record(z.unknown()).optional(),
});

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

export const Route = createFileRoute("/api/submit-form")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: cors });
        }

        const parsed = SubmitSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Invalid input", issues: parsed.error.issues },
            { status: 400, headers: cors },
          );
        }

        const url = process.env["POCKETBASE_URL"] ?? process.env["VITE_POCKETBASE_URL"];
        if (!url) {
          return Response.json({ ok: false, error: "Server not configured" }, { status: 500, headers: cors });
        }

        const pb = new PocketBase(url.replace(/\/+$/, ""));
        pb.autoCancellation(false);

        const { form_type, name, email, phone, company, message, payload } = parsed.data;

        try {
          // form_submissions Create rule is public (anyone can submit),
          // matching "Anyone can submit a form" from the original schema.
          await pb.collection("form_submissions").create({
            form_type,
            name: name ?? null,
            email: email ?? null,
            phone: phone ?? null,
            company: company ?? null,
            message: message ?? null,
            payload: payload ?? {},
          });
        } catch (err: any) {
          return Response.json(
            { ok: false, error: err?.message ?? "Could not submit" },
            { status: 500, headers: cors },
          );
        }

        return Response.json({ ok: true }, { headers: cors });
      },
    },
  },
});
