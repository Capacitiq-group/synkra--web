import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { computeQuote, type QualificationAnswers } from "@/lib/autoQuote";

const SERVICE_LABELS: Record<string, string> = {
  "ai-voice-agent": "AI Voice Agent",
  "speed-to-lead": "Speed to Lead",
  "lead-reactivation": "Lead Reactivation",
};

const QualifyInput = z.object({
  contact_name: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().min(1),
  company_name: z.string().min(1),
  service: z.enum(["ai-voice-agent", "speed-to-lead", "lead-reactivation"]),
  monthly_volume: z.enum(["under_100", "100_300", "300_800", "800_plus"]),
  integrations_needed: z.enum(["0_1", "2_3", "4_plus"]),
  multiple_sources: z.boolean(),
  complex_logic: z.boolean(),
  company_size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
});

export const submitQualification = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => QualifyInput.parse(d))
  .handler(async ({ data }) => {
    const answers: QualificationAnswers = {
      service: data.service,
      monthly_volume: data.monthly_volume,
      integrations_needed: data.integrations_needed,
      multiple_sources: data.multiple_sources,
      complex_logic: data.complex_logic,
      company_size: data.company_size,
    };
    const quote = computeQuote(answers);

    const coreUrl = process.env["CORE_API_URL"];
    const secret = process.env["SYNKRA_INTERNAL_SECRET"];
    if (!coreUrl || !secret) {
      return { ok: false, error: "Quote engine is not configured (missing CORE_API_URL / SYNKRA_INTERNAL_SECRET)." };
    }

    try {
      const res = await fetch(`${coreUrl.replace(/\/+$/, "")}/agency-quotes`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-synkra-secret": secret },
        body: JSON.stringify({
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          company_name: data.company_name,
          service_slug: data.service,
          service_label: SERVICE_LABELS[data.service],
          computed_tier: quote.tier,
          computed_monthly: quote.monthly,
          computed_setup: quote.setup,
          passed: quote.passed,
          qualification_answers: answers,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return { ok: false, error: `Quote engine error (${res.status}): ${body.slice(0, 200)}` };
      }
      const result = await res.json();
      return {
        ok: true,
        tier: quote.tier,
        monthly: quote.monthly,
        setup: quote.setup,
        sent: !!result.sent,
      };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Could not reach the quote engine." };
    }
  });
