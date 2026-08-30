import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";
import { submitIntegrationPartnerApplication } from "@/lib/partnerIntegration.functions";
import {
  EMPTY_FORM,
  type IntegrationPartnerFormData,
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  PLATFORM_CATEGORY_OPTIONS,
  PLATFORM_USER_OPTIONS,
  GEOGRAPHIC_MARKET_OPTIONS,
  HAS_API_OPTIONS,
  API_TYPE_OPTIONS,
  YES_NO_NOT_SURE,
  YES_NO,
  AUTH_TYPE_OPTIONS,
  EXPOSABLE_ACTIONS,
  EXISTING_INTEGRATION_OPTIONS,
  MARKETPLACE_OPTIONS,
  INTEREST_TYPE_OPTIONS,
  CUSTOMER_COUNT_OPTIONS,
  SA_PERCENTAGE_OPTIONS,
  ACCESS_PRICING_OPTIONS,
  PARTNER_PRICING_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
} from "@/lib/partnerIntegrationTypes";

export const Route = createFileRoute("/partner/integration")({
  head: () =>
    buildHead({
      title: "Integration Partner Application",
      description:
        "Apply to integrate your platform with Synkra. For CRMs, accounting, ERP, e-commerce, payments, and other business platforms.",
      path: "/partner/integration",
    }),
  component: IntegrationPartnerPage,
});

function IntegrationPartnerPage() {
  const [form, setForm] = useState<IntegrationPartnerFormData>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof IntegrationPartnerFormData>(key: K, value: IntegrationPartnerFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArr(key: keyof IntegrationPartnerFormData, value: string) {
    setForm((f) => {
      const arr = f[key] as string[];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...f, [key]: next };
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.consent_accurate) {
      setError("You must confirm the information is accurate before submitting.");
      return;
    }
    setBusy(true);
    try {
      const res = await submitIntegrationPartnerApplication({ data: form });
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding text-center">
          <p className="label-tag text-[var(--color-brand-green)]">Application received</p>
          <h1 className="heading-display mt-6">Thank you.</h1>
          <p className="body-text mx-auto mt-6 max-w-[520px]">
            We've received your Integration Partner application for{" "}
            {form.company_name}. You'll get a confirmation email shortly, and
            our team will be in touch after reviewing it.
          </p>
        </div>
      </section>
    );
  }

  const showTechContact = form.has_api && form.has_api !== "no";

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Partner With Synkra</p>
        <h1 className="heading-display mt-6 max-w-[800px]">
          Synkra Integration Partner Application
        </h1>
        <p className="body-text mt-6 max-w-[600px]">
          Tell us about your platform. This helps us understand where an
          integration with Synkra would create real value for both of our
          customers.
        </p>
      </div>

      <div className="container-main">
        <div className="hairline" />
      </div>

      <form onSubmit={submit} className="container-main section-padding space-y-16">
        {/* Section 1 */}
        <Section n="01" title="Company information">
          <Grid>
            <Text label="Company / business name" required value={form.company_name} onChange={(v) => set("company_name", v)} />
            <Text label="Website" required value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
            <Text label="Country" required value={form.country} onChange={(v) => set("country", v)} />
            <Text label="Primary market(s)" required value={form.primary_markets} onChange={(v) => set("primary_markets", v)} />
            <Select label="Industry / category" required value={form.industry} onChange={(v) => set("industry", v)} options={INDUSTRY_OPTIONS as unknown as string[]} />
            <Select label="Company size" required value={form.company_size} onChange={(v) => set("company_size", v)} options={COMPANY_SIZE_OPTIONS as unknown as string[]} />
          </Grid>
        </Section>

        {/* Section 2 */}
        <Section n="02" title="Contact person">
          <Grid>
            <Text label="Full name" required value={form.contact_name} onChange={(v) => set("contact_name", v)} />
            <Text label="Job title / role" required value={form.contact_title} onChange={(v) => set("contact_title", v)} />
            <Text label="Work email" required type="email" value={form.contact_email} onChange={(v) => set("contact_email", v)} />
            <Text label="Phone number" required value={form.contact_phone} onChange={(v) => set("contact_phone", v)} />
            <Select label="Preferred contact method" required value={form.preferred_contact_method} onChange={(v) => set("preferred_contact_method", v)} options={PREFERRED_CONTACT_OPTIONS as unknown as string[]} />
          </Grid>
        </Section>

        {/* Section 3 */}
        <Section n="03" title="Platform information" note="This is the most important section.">
          <Grid>
            <Text label="Platform name" required value={form.platform_name} onChange={(v) => set("platform_name", v)} />
          </Grid>
          <TextArea label="What does your platform do? Short description." required value={form.platform_description} onChange={(v) => set("platform_description", v)} />
          <CheckboxGroup label="Platform category (select all that apply)" options={PLATFORM_CATEGORY_OPTIONS as unknown as string[]} selected={form.platform_categories} onToggle={(v) => toggleArr("platform_categories", v)} />
          <CheckboxGroup label="Who uses your platform?" options={PLATFORM_USER_OPTIONS as unknown as string[]} selected={form.platform_users} onToggle={(v) => toggleArr("platform_users", v)} />
          <CheckboxGroup label="Geographic market" options={GEOGRAPHIC_MARKET_OPTIONS as unknown as string[]} selected={form.geographic_market} onToggle={(v) => toggleArr("geographic_market", v)} />
        </Section>

        {/* Section 4 */}
        <Section n="04" title="Integration capabilities">
          <Radio label="Does your platform currently offer an API?" value={form.has_api} onChange={(v) => set("has_api", v)} options={HAS_API_OPTIONS as unknown as string[]} />
          {form.has_api === "yes" && (
            <Grid>
              <Text label="API documentation URL" value={form.api_docs_url} onChange={(v) => set("api_docs_url", v)} />
              <Select label="API type" value={form.api_type} onChange={(v) => set("api_type", v)} options={API_TYPE_OPTIONS as unknown as string[]} />
            </Grid>
          )}
          <Radio label="Does your platform support webhooks?" value={form.has_webhooks} onChange={(v) => set("has_webhooks", v)} options={YES_NO_NOT_SURE as unknown as string[]} />
          <Radio
            label="Authentication"
            value={form.auth_type}
            onChange={(v) => set("auth_type", v)}
            options={AUTH_TYPE_OPTIONS as unknown as string[]}
            labels={{ oauth2: "OAuth 2.0", api_keys: "API keys", oauth2_and_api_keys: "OAuth + API keys", other: "Other", none: "No authentication system for integrations" }}
          />
          <Radio label="Do you have a developer / integration portal?" value={form.has_dev_portal} onChange={(v) => set("has_dev_portal", v)} options={YES_NO as unknown as string[]} />
          {form.has_dev_portal === "yes" && (
            <Text label="Developer documentation URL" value={form.dev_docs_url} onChange={(v) => set("dev_docs_url", v)} />
          )}
        </Section>

        {/* Section 5 */}
        <Section n="05" title="What could Synkra integrate with?" note="What data / actions would you be willing to expose through an integration?">
          {Object.entries(EXPOSABLE_ACTIONS).map(([group, items]) => (
            <CheckboxGroup key={group} label={group} options={items} selected={form.exposable_actions} onToggle={(v) => toggleArr("exposable_actions", v)} />
          ))}
          <TextArea label="What other integration capabilities would you like Synkra to support?" value={form.other_capabilities} onChange={(v) => set("other_capabilities", v)} rows={2} />
        </Section>

        {/* Section 6 */}
        <Section n="06" title="Existing integration ecosystem">
          <CheckboxGroup label="Does your platform currently integrate with other automation platforms?" options={EXISTING_INTEGRATION_OPTIONS as unknown as string[]} selected={form.existing_integrations} onToggle={(v) => toggleArr("existing_integrations", v)} />
          {form.existing_integrations.includes("Other") && (
            <Text label="Which ones?" value={form.existing_integrations_other} onChange={(v) => set("existing_integrations_other", v)} />
          )}
          <Radio label="Do you currently have a public integration marketplace?" value={form.has_marketplace} onChange={(v) => set("has_marketplace", v)} options={MARKETPLACE_OPTIONS as unknown as string[]} />
          <Radio label="Do you already have third-party developers building integrations?" value={form.has_third_party_devs} onChange={(v) => set("has_third_party_devs", v)} options={YES_NO_NOT_SURE as unknown as string[]} />
        </Section>

        {/* Section 7 */}
        <Section n="07" title="Partnership interest">
          <CheckboxGroup label="What are you interested in? (select all that apply)" options={INTEREST_TYPE_OPTIONS as unknown as string[]} selected={form.interest_types} onToggle={(v) => toggleArr("interest_types", v)} />
          <TextArea label="Why are you interested in partnering with Synkra?" value={form.why_partner} onChange={(v) => set("why_partner", v)} rows={2} />
          <TextArea label="What would you like customers to be able to do through the Synkra integration?" value={form.desired_integration_outcome} onChange={(v) => set("desired_integration_outcome", v)} rows={2} />
        </Section>

        {/* Section 8 */}
        <Section n="08" title="Customer overlap">
          <Select label="How many active customers does your platform have?" value={form.customer_count_range} onChange={(v) => set("customer_count_range", v)} options={CUSTOMER_COUNT_OPTIONS as unknown as string[]} />
          <Radio label="What percentage of your customers are based in South Africa?" value={form.sa_customer_percentage} onChange={(v) => set("sa_customer_percentage", v)} options={SA_PERCENTAGE_OPTIONS as unknown as string[]} />
          <TextArea label="What types of businesses use your platform?" value={form.customer_business_types} onChange={(v) => set("customer_business_types", v)} rows={2} />
        </Section>

        {/* Section 9 - conditional */}
        {showTechContact && (
          <Section n="09" title="Technical contact">
            <Grid>
              <Text label="Technical contact name" value={form.tech_contact_name} onChange={(v) => set("tech_contact_name", v)} />
              <Text label="Technical contact email" type="email" value={form.tech_contact_email} onChange={(v) => set("tech_contact_email", v)} />
            </Grid>
            <Radio label="Sandbox available?" value={form.sandbox_available} onChange={(v) => set("sandbox_available", v)} options={YES_NO as unknown as string[]} />
            <Radio label="Test credentials available?" value={form.test_credentials_available} onChange={(v) => set("test_credentials_available", v)} options={YES_NO as unknown as string[]} />
            <Radio label="Developer account available?" value={form.dev_account_available} onChange={(v) => set("dev_account_available", v)} options={YES_NO as unknown as string[]} />
          </Section>
        )}

        {/* Section 10 */}
        <Section n="10" title="Commercial information">
          <Select label="Is your API / integration access:" value={form.access_pricing_model} onChange={(v) => set("access_pricing_model", v)} options={ACCESS_PRICING_OPTIONS as unknown as string[]} labels={{ free: "Free", included_in_subscription: "Included in subscription", paid: "Paid", usage_based: "Usage-based", enterprise_only: "Enterprise-only", not_sure: "Not sure" }} />
          <Radio label="Are there additional costs for third-party integrations?" value={form.has_additional_third_party_costs} onChange={(v) => set("has_additional_third_party_costs", v)} options={YES_NO_NOT_SURE as unknown as string[]} />
          <Radio label="Do you offer partner pricing?" value={form.has_partner_pricing} onChange={(v) => set("has_partner_pricing", v)} options={PARTNER_PRICING_OPTIONS as unknown as string[]} />
          <Radio label="Do you have a referral or partner programme?" value={form.has_referral_program} onChange={(v) => set("has_referral_program", v)} options={YES_NO as unknown as string[]} />
          {form.has_referral_program === "yes" && (
            <TextArea label="Please provide details or a link." value={form.referral_program_details} onChange={(v) => set("referral_program_details", v)} rows={2} />
          )}
        </Section>

        {/* Section 12 - Consent */}
        <Section n="11" title="Consent">
          <label className="flex items-start gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              required
              checked={form.consent_accurate}
              onChange={(e) => set("consent_accurate", e.target.checked)}
              className="mt-1"
            />
            <span>
              I confirm that the information provided is accurate and that I
              am authorised to submit this partnership enquiry on behalf of
              the organisation. <span className="text-white/40">(Required)</span>
            </span>
          </label>
          <label className="mt-4 flex items-start gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={form.consent_marketing}
              onChange={(e) => set("consent_marketing", e.target.checked)}
              className="mt-1"
            />
            <span>
              I'd like to receive occasional updates from Synkra about
              integrations, partnerships, products and related opportunities.{" "}
              <span className="text-white/40">(Optional)</span>
            </span>
          </label>
        </Section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Submitting..." : "Submit application"}
        </button>
      </form>

      <style>{`
        .pi-input, .pi-select, .pi-textarea {
          width: 100%; border-radius: 0.375rem; border: 1px solid rgba(255,255,255,0.1);
          background: #0f0f0f; padding: 0.625rem 0.75rem; font-size: 0.875rem; color: white;
        }
        .pi-input:focus, .pi-select:focus, .pi-textarea:focus { outline: none; border-color: #56d722; }
      `}</style>
    </section>
  );
}

// ---------- small form building blocks ----------

function Section({ n, title, note, children }: { n: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-4">
        <span className="numeral-sm text-white/30">{n}</span>
        <h2 className="heading-card">{title}</h2>
      </div>
      {note && <p className="body-sm mt-2 text-white/50">{note}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>;
}

function Text({
  label, value, onChange, required, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}{required && <span className="text-[var(--color-brand-green)]"> *</span>}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pi-input mt-2"
      />
    </label>
  );
}

function TextArea({
  label, value, onChange, required, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}{required && <span className="text-[var(--color-brand-green)]"> *</span>}</span>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pi-textarea mt-2"
      />
    </label>
  );
}

function Select({
  label, value, onChange, options, required, labels,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; labels?: Record<string, string> }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}{required && <span className="text-[var(--color-brand-green)]"> *</span>}</span>
      <select required={required} value={value} onChange={(e) => onChange(e.target.value)} className="pi-select mt-2">
        <option value="" disabled>Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{labels?.[o] ?? o}</option>
        ))}
      </select>
    </label>
  );
}

function Radio({
  label, value, onChange, options, labels,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; labels?: Record<string, string> }) {
  return (
    <div>
      <span className="label-tag block">{label}</span>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              value === o
                ? "bg-[#56d722] text-[#0a0a0a] font-semibold"
                : "border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {labels?.[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({
  label, options, selected, onToggle,
}: { label: string; options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <span className="label-tag block">{label}</span>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-[#56d722] bg-[#56d722]/10 text-[#56d722]"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
