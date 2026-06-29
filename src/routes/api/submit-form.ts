// Public form submission endpoint for Synkra.
// All site forms POST JSON here; submissions are written to the
// `form_submissions` table in Supabase. The single notification address
// (Synkra@capacitiqgroup.co.za) can be wired up later via an email
// provider — for now we only persist.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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
          return Response.json(
            { ok: false, error: "Invalid JSON" },
            { status: 400, headers: cors },
          );
        }

        const parsed = SubmitSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Invalid input", issues: parsed.error.issues },
            { status: 400, headers: cors },
          );
        }

        // Use the publishable Supabase client server-side. Inserts are allowed
        // for anon under the RLS policy on `form_submissions`.
        const { createClient } = await import("@supabase/supabase-js");
        const url =
          process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ??
          process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return Response.json(
            { ok: false, error: "Server not configured" },
            { status: 500, headers: cors },
          );
        }

        const supabase = createClient(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            storage: undefined,
          },
        });

        const { form_type, name, email, phone, company, message, payload } =
          parsed.data;

        const { error } = await supabase.from("form_submissions").insert({
          form_type,
          name: name ?? null,
          email: email ?? null,
          phone: phone ?? null,
          company: company ?? null,
          message: message ?? null,
          payload: payload ?? {},
        });

        if (error) {
          return Response.json(
            { ok: false, error: error.message },
            { status: 500, headers: cors },
          );
        }

        return Response.json({ ok: true }, { headers: cors });
      },
    },
  },
});
