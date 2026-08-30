import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import PocketBase from "pocketbase";
import { requireAdminAuth } from "@/integrations/pocketbase/auth-middleware";
import { scorePartnerApplication } from "@/lib/aiScoring.server";
import { sendEmail } from "@/lib/email.server";

function publicClient(): PocketBase {
  const url = process.env["POCKETBASE_URL"] ?? process.env["VITE_POCKETBASE_URL"];
  if (!url) throw new Error("Missing POCKETBASE_URL environment variable.");
  const pb = new PocketBase(url.replace(/\/+$/, ""));
  pb.autoCancellation(false);
  return pb;
}

const IntegrationPartnerInput = z.object({
  company_name: z.string().min(1),
  website: z.string().min(1),
  country: z.string().min(1),
  primary_markets: z.string().optional().default(""),
  industry: z.string().min(1),
  company_size: z.string().min(1),

  contact_name: z.string().min(1),
  contact_title: z.string().optional().default(""),
  contact_email: z.string().email(),
  contact_phone: z.string().optional().default(""),
  preferred_contact_method: z.string().optional().default(""),

  platform_name: z.string().min(1),
  platform_description: z.string().min(1),
  platform_categories: z.array(z.string()).default([]),
  platform_users: z.array(z.string()).default([]),
  geographic_market: z.array(z.string()).default([]),

  has_api: z.string().min(1),
  api_docs_url: z.string().optional().default(""),
  api_type: z.string().optional().default(""),
  has_webhooks: z.string().optional().default(""),
  auth_type: z.string().optional().default(""),
  has_dev_portal: z.string().optional().default(""),
  dev_docs_url: z.string().optional().default(""),

  exposable_actions: z.array(z.string()).default([]),
  other_capabilities: z.string().optional().default(""),

  existing_integrations: z.array(z.string()).default([]),
  existing_integrations_other: z.string().optional().default(""),
  has_marketplace: z.string().optional().default(""),
  has_third_party_devs: z.string().optional().default(""),

  interest_types: z.array(z.string()).default([]),
  why_partner: z.string().optional().default(""),
  desired_integration_outcome: z.string().optional().default(""),

  customer_count_range: z.string().optional().default(""),
  sa_customer_percentage: z.string().optional().default(""),
  customer_business_types: z.string().optional().default(""),

  tech_contact_name: z.string().optional().default(""),
  tech_contact_email: z.string().optional().default(""),
  sandbox_available: z.string().optional().default(""),
  test_credentials_available: z.string().optional().default(""),
  dev_account_available: z.string().optional().default(""),

  access_pricing_model: z.string().optional().default(""),
  has_additional_third_party_costs: z.string().optional().default(""),
  has_partner_pricing: z.string().optional().default(""),
  has_referral_program: z.string().optional().default(""),
  referral_program_details: z.string().optional().default(""),

  consent_accurate: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the information is accurate before submitting." }),
  }),
  consent_marketing: z.boolean().default(false),
});

export const submitIntegrationPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => IntegrationPartnerInput.parse(d))
  .handler(async ({ data }) => {
    const pb = publicClient();

    let record: any;
    try {
      record = await pb.collection("integration_partner_applications").create(data);
    } catch (err: any) {
      return { ok: false, error: err?.message ?? "Could not submit your application." };
    }

    // AI scoring: advisory only, never blocks the submission from
    // succeeding. A failure here is recorded on the record, not thrown.
    try {
      const result = await scorePartnerApplication(data);
      await pb.collection("integration_partner_applications").update(record.id, {
        ai_score: result.total_score,
        ai_flag: result.flag,
        ai_category_scores: result.category_scores,
        ai_strengths: result.strengths,
        ai_risks: result.risks,
        ai_missing_information: result.missing_information,
        ai_summary: result.summary,
        ai_scored_at: new Date().toISOString(),
        ai_scoring_error: null,
      });
    } catch (err: any) {
      await pb
        .collection("integration_partner_applications")
        .update(record.id, { ai_scoring_error: err?.message ?? "Unknown scoring error" })
        .catch(() => {});
    }

    // Confirmation email: name + company only, never the full submission.
    // Fire-and-forget - a failed email must never fail the submission.
    sendEmail({
      to: data.contact_email,
      subject: "We've received your Synkra Integration Partner application",
      html: `
        <p>Hi ${data.contact_name},</p>
        <p>Thanks for submitting an Integration Partner application for ${data.company_name}. Our team will review it and be in touch.</p>
        <p>— Synkra</p>
      `,
    }).catch(() => {});

    return { ok: true, id: record.id };
  });

export const listIntegrationPartnerApplications = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("integration_partner_applications").getFullList({ sort: "-created" });
  });

export const updateIntegrationPartnerStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().min(1),
        status: z.enum(["new", "reviewing", "contacted", "approved", "declined"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await context.pb
      .collection("integration_partner_applications")
      .update(data.id, { status: data.status });
    return { ok: true };
  });
