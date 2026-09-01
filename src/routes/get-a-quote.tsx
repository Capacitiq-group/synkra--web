import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { buildHead } from "@/lib/seo";
import { submitQualification } from "@/lib/agencyQuote.functions";

const SearchSchema = z.object({
  service: z.enum(["ai-voice-agent", "speed-to-lead", "lead-reactivation"]).optional(),
});

const SERVICE_OPTIONS = [
  { value: "ai-voice-agent", label: "AI Voice Agent" },
  { value: "speed-to-lead", label: "Speed to Lead" },
  { value: "lead-reactivation", label: "Lead Reactivation" },
] as const;

export const Route = createFileRoute("/get-a-quote")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () =>
    buildHead({
      title: "Get a Quote",
      description:
        "Answer a few questions about your business and get a tailored quote for AI Voice Agent, Speed to Lead, or Lead Reactivation.",
      path: "/get-a-quote",
    }),
  component: GetAQuotePage,
});

function GetAQuotePage() {
  const { service: serviceFromSearch } = Route.useSearch();
  const nav = useNavigate();

  const [service, setService] = useState<(typeof SERVICE_OPTIONS)[number]["value"]>(
    serviceFromSearch ?? "ai-voice-agent",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [volume, setVolume] = useState<"under_100" | "100_300" | "300_800" | "800_plus">("under_100");
  const [integrations, setIntegrations] = useState<"0_1" | "2_3" | "4_plus">("0_1");
  const [multipleSources, setMultipleSources] = useState(false);
  const [complexLogic, setComplexLogic] = useState(false);
  const [companySize, setCompanySize] = useState<"1-10" | "11-50" | "51-200" | "201-500" | "500+">("1-10");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ tier: string; monthly: number; setup: number; sent: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitQualification({
        data: {
          contact_name: name,
          contact_email: email,
          contact_phone: phone,
          company_name: company,
          service,
          monthly_volume: volume,
          integrations_needed: integrations,
          multiple_sources: multipleSources,
          complex_logic: complexLogic,
          company_size: companySize,
        },
      });
      if (res.ok) {
        setResult({ tier: res.tier!, monthly: res.monthly!, setup: res.setup!, sent: res.sent! });
      } else {
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding text-center">
          <p className="label-tag text-[var(--color-brand-green)]">
            {result.sent ? "Quote sent" : "Quote created"}
          </p>
          <h1 className="heading-display mt-6">
            {result.tier[0].toUpperCase() + result.tier.slice(1)} tier: R{result.setup.toLocaleString()} setup,
            R{result.monthly.toLocaleString()}/month
          </h1>
          <p className="body-text mx-auto mt-6 max-w-[520px]">
            {result.sent
              ? "A formal quotation has been emailed to you directly. Check your inbox, you can accept it straight from there."
              : "Your answers need a quick look from our team before the formal quotation goes out. We'll be in touch shortly."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Get a Quote</p>
        <h1 className="heading-display mt-6 max-w-[700px]">
          Answer a few questions, get a real number.
        </h1>
        <p className="body-text mt-6 max-w-[520px]">
          This isn't a ballpark. Based on your answers, you'll get an
          exact setup fee and monthly price, and where the answers are
          clear-cut, a formal quotation lands in your inbox automatically.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <form onSubmit={submit} className="mx-auto max-w-[560px] space-y-6">
          <Select label="Which service?" value={service} onChange={(v) => setService(v as any)} options={SERVICE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />

          <div className="hairline" />

          <Field label="Full name" required value={name} onChange={setName} />
          <Field label="Email" required type="email" value={email} onChange={setEmail} />
          <Field label="Phone number" required value={phone} onChange={setPhone} />
          <Field label="Company name" required value={company} onChange={setCompany} />
          <Select label="Company size" value={companySize} onChange={(v) => setCompanySize(v as any)} options={[
            { value: "1-10", label: "1-10 employees" },
            { value: "11-50", label: "11-50 employees" },
            { value: "51-200", label: "51-200 employees" },
            { value: "201-500", label: "201-500 employees" },
            { value: "500+", label: "500+ employees" },
          ]} />

          <div className="hairline" />

          <Select
            label="Estimated monthly volume (calls, leads, or contacts, depending on the service)"
            value={volume}
            onChange={(v) => setVolume(v as any)}
            options={[
              { value: "under_100", label: "Under 100 a month" },
              { value: "100_300", label: "100-300 a month" },
              { value: "300_800", label: "300-800 a month" },
              { value: "800_plus", label: "800+ a month" },
            ]}
          />
          <Select
            label="How many other systems does this need to integrate with?"
            value={integrations}
            onChange={(v) => setIntegrations(v as any)}
            options={[
              { value: "0_1", label: "0-1 (e.g. just a calendar)" },
              { value: "2_3", label: "2-3 (e.g. CRM + calendar + one more)" },
              { value: "4_plus", label: "4 or more" },
            ]}
          />
          <Checkbox label="I need multiple phone numbers, lead sources, or campaigns running at once" checked={multipleSources} onChange={setMultipleSources} />
          <Checkbox label="I need complex custom logic (multi-step qualification, dynamic routing or segmentation)" checked={complexLogic} onChange={setComplexLogic} />

          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Calculating..." : "Get my quote"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, required, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}{required && <span className="text-[var(--color-brand-green)]"> *</span>}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white focus:border-[var(--color-brand-green)] focus:outline-none"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white focus:border-[var(--color-brand-green)] focus:outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <span className="text-sm text-white/80">{label}</span>
    </label>
  );
}
