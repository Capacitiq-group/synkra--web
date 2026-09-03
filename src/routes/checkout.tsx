import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { buildHead } from "@/lib/seo";
import {
  FLOW_ADDONS,
  FLOW_PLANS,
  formatCents,
  type PlanId,
  type BillingPeriod,
  type Quote,
} from "@/lib/pricing";
import { submitCheckoutFn, previewQuoteFn } from "@/lib/checkout.functions";

const SearchSchema = z.object({
  plan: z.enum(["free", "basic", "pro"]).optional(),
});

const STEPS = [
  "Plan",
  "Your details",
  "Business",
  "How you heard about us",
  "Consent",
  "Payment",
] as const;

const HOW_HEARD_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "google", label: "Google search" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Referral from someone" },
  { value: "synkra_website", label: "Synkra website / another Synkra product" },
  { value: "agency_client", label: "I'm an existing Synkra Agency client" },
  { value: "other", label: "Other" },
];

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () =>
    buildHead({
      title: "Checkout, Synkra Flow",
      description: "Set up your Synkra Flow account.",
      path: "/checkout",
    }),
  component: CheckoutPage,
});

type AddonSelection = Record<string, number>;

function CheckoutPage() {
  const { plan: planFromSearch } = Route.useSearch();
  const [step, setStep] = useState(0);

  // Step 1: plan
  const [planId, setPlanId] = useState<PlanId>(planFromSearch ?? "free");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [addons, setAddons] = useState<AddonSelection>({});

  // Step 2: customer info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isStudent, setIsStudent] = useState(false);

  // Step 3: business info
  const [businessName, setBusinessName] = useState("");

  // Step 4: attribution
  const [howHeard, setHowHeard] = useState("");

  // Step 5: consent
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 6: payment
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [freeActivated, setFreeActivated] = useState(false);

  const addonList = Object.entries(addons)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => ({ id, quantity }));

  async function goToPayment() {
    setQuoteError(null);
    const res = await previewQuoteFn({
      data: { product: "flow", planId, billingPeriod, isStudent, addons: addonList },
    });
    if (!res.ok) {
      setQuoteError(res.message);
      return;
    }
    setQuote(res.quote);
    setStep(5);
  }

  async function submit() {
    setBusy(true);
    setSubmitError(null);
    try {
      const res = await submitCheckoutFn({
        data: {
          product: "flow",
          planId,
          billingPeriod,
          isStudent,
          addons: addonList,
          email,
          name,
          marketingConsent,
          termsAccepted,
          ...(phone ? { phone } : {}),
          ...(businessName ? { businessName } : {}),
          ...(howHeard ? { howHeard } : {}),
        },
      });
      if (!res.ok) {
        setSubmitError(res.message);
        return;
      }
      if (res.authorizationUrl) {
        window.location.href = res.authorizationUrl;
        return;
      }
      setFreeActivated(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (freeActivated) {
    return (
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding text-center">
          <p className="label-tag">Checkout</p>
          <h1 className="heading-display mt-6 max-w-[600px] mx-auto">
            Your Flow account is ready.
          </h1>
          <p className="body-text mt-6 max-w-[480px] mx-auto">
            We sent a single-use sign-in link to {email}. It expires in 30
            minutes, use it to get into your account.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Checkout</p>
        <h1 className="heading-display mt-6 max-w-[600px]">Set up your Synkra Flow account.</h1>

        {/* Progress bar */}
        <div className="mt-10 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`h-1.5 w-full rounded-full ${
                  i <= step ? "bg-[var(--color-brand-green)]" : "bg-white/10"
                }`}
              />
              <span className="hidden text-center text-[11px] text-white/50 sm:block">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-main">
        <div className="hairline" />
      </div>

      <div className="container-main section-padding">
        <div className="mx-auto max-w-[560px]">
          {step === 0 && (
            <PlanStep
              planId={planId}
              setPlanId={setPlanId}
              billingPeriod={billingPeriod}
              setBillingPeriod={setBillingPeriod}
              addons={addons}
              setAddons={setAddons}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <CustomerStep
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              isStudent={isStudent}
              setIsStudent={setIsStudent}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <BusinessStep
              businessName={businessName}
              setBusinessName={setBusinessName}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <AttributionStep
              howHeard={howHeard}
              setHowHeard={setHowHeard}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <ConsentStep
              marketingConsent={marketingConsent}
              setMarketingConsent={setMarketingConsent}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              onBack={() => setStep(3)}
              onNext={goToPayment}
              error={quoteError}
            />
          )}
          {step === 5 && quote && (
            <PaymentStep
              quote={quote}
              busy={busy}
              error={submitError}
              onBack={() => setStep(4)}
              onSubmit={submit}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// --- Step 1: Plan, billing period, add-ons -------------------------------

function PlanStep({
  planId,
  setPlanId,
  billingPeriod,
  setBillingPeriod,
  addons,
  setAddons,
  onNext,
}: {
  planId: PlanId;
  setPlanId: (v: PlanId) => void;
  billingPeriod: BillingPeriod;
  setBillingPeriod: (v: BillingPeriod) => void;
  addons: AddonSelection;
  setAddons: (v: AddonSelection) => void;
  onNext: () => void;
}) {
  const isPaid = planId !== "free";
  return (
    <div className="space-y-8">
      <div>
        <p className="label-tag mb-3">Choose your plan</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {FLOW_PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                planId === p.id
                  ? "border-[var(--color-brand-green)] bg-[#0f0f0f]"
                  : "border-white/10 bg-transparent hover:border-white/30"
              }`}
            >
              <p className="text-sm font-semibold text-white">{p.name}</p>
              <p className="mt-1 text-xs text-white/60">{formatCents(p.monthlyCents)}/mo</p>
            </button>
          ))}
        </div>
      </div>

      {isPaid && (
        <div>
          <p className="label-tag mb-3">Billing period</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                billingPeriod === "monthly"
                  ? "border-[var(--color-brand-green)] bg-[#0f0f0f]"
                  : "border-white/10 bg-transparent hover:border-white/30"
              }`}
            >
              <p className="text-sm font-semibold text-white">Monthly</p>
              <p className="mt-1 text-xs text-white/60">Cancel any time.</p>
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("annual")}
              className={`rounded-lg border p-4 text-left transition-colors ${
                billingPeriod === "annual"
                  ? "border-[var(--color-brand-green)] bg-[#0f0f0f]"
                  : "border-white/10 bg-transparent hover:border-white/30"
              }`}
            >
              <p className="text-sm font-semibold text-white">Annual</p>
              <p className="mt-1 text-xs text-white/60">Paid upfront, worth 2 months free.</p>
            </button>
          </div>
        </div>
      )}

      {isPaid && FLOW_ADDONS.length > 0 && (
        <div>
          <p className="label-tag mb-3">Add-ons (optional)</p>
          <div className="space-y-3">
            {FLOW_ADDONS.map((addon) => {
              const qty = addons[addon.id] ?? 0;
              return (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 p-4"
                >
                  <div>
                    <p className="text-sm text-white">{addon.name}</p>
                    <p className="text-xs text-white/50">
                      {formatCents(addon.priceCents)} - {addon.packDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, [addon.id]: Math.max(0, qty - 1) })}
                      className="h-8 w-8 rounded-full border border-white/20 text-white"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-sm text-white">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setAddons({ ...addons, [addon.id]: qty + 1 })}
                      className="h-8 w-8 rounded-full border border-white/20 text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button type="button" onClick={onNext} className="btn-primary w-full justify-center">
        Continue
      </button>
    </div>
  );
}

// --- Step 2: Customer info + student election ------------------------------

function CustomerStep({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  isStudent,
  setIsStudent,
  onBack,
  onNext,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  isStudent: boolean;
  setIsStudent: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const canContinue = name.trim().length > 0 && email.trim().length > 4;
  return (
    <div className="space-y-6">
      <Field label="Full name" required value={name} onChange={setName} />
      <Field label="Email" required type="email" value={email} onChange={setEmail} />
      <Field label="Phone (optional)" value={phone} onChange={setPhone} />

      <Checkbox
        label="I'm a student, and my business is student-owned. I qualify for discounted Flow pricing."
        checked={isStudent}
        onChange={setIsStudent}
      />
      {isStudent && (
        <p className="text-xs text-white/50">
          You'll need a student email address issued by your institution, or an official
          university document (proof of registration or an academic transcript) showing your
          full name and current 2026 enrolment. You can upload this once your account is set up -
          the discount applies automatically once it's verified.
        </p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="btn-primary flex-1 justify-center disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// --- Step 3: Business info ------------------------------------------------

function BusinessStep({
  businessName,
  setBusinessName,
  onBack,
  onNext,
}: {
  businessName: string;
  setBusinessName: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Business or company name (optional)" value={businessName} onChange={setBusinessName} />
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary flex-1 justify-center">
          Continue
        </button>
      </div>
    </div>
  );
}

// --- Step 4: Marketing attribution -----------------------------------------

function AttributionStep({
  howHeard,
  setHowHeard,
  onBack,
  onNext,
}: {
  howHeard: string;
  setHowHeard: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <Select
        label="How did you hear about us? (optional)"
        value={howHeard}
        onChange={setHowHeard}
        options={HOW_HEARD_OPTIONS}
      />
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary flex-1 justify-center">
          Continue
        </button>
      </div>
    </div>
  );
}

// --- Step 5: Consent ---------------------------------------------------

function ConsentStep({
  marketingConsent,
  setMarketingConsent,
  termsAccepted,
  setTermsAccepted,
  onBack,
  onNext,
  error,
}: {
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <Checkbox
        label="Yes, I'd like to receive product updates, useful resources, offers and other communications from Synkra."
        checked={marketingConsent}
        onChange={setMarketingConsent}
      />
      <Checkbox
        label={
          <>
            I agree to Synkra's{" "}
            <a href="/legal/terms-of-service" target="_blank" rel="noreferrer" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/legal/privacy-policy" target="_blank" rel="noreferrer" className="underline">
              Privacy Policy
            </a>
            .
          </>
        }
        checked={termsAccepted}
        onChange={setTermsAccepted}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 justify-center">
          Back
        </button>
        <button
          type="button"
          disabled={!termsAccepted}
          onClick={onNext}
          className="btn-primary flex-1 justify-center disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// --- Step 6: Payment / order summary ----------------------------------

function PaymentStep({
  quote,
  busy,
  error,
  onBack,
  onSubmit,
}: {
  quote: Quote;
  busy: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 p-6">
        <p className="label-tag mb-4">Order summary</p>
        <SummaryRow label="Plan" value={quote.planName} />
        <SummaryRow
          label="Billing period"
          value={quote.billingPeriod === "annual" ? "Annual (paid upfront)" : "Monthly"}
        />
        {quote.addonLines.map((line) => (
          <SummaryRow key={line.key} label={line.label} value={formatCents(line.amountCents)} />
        ))}
        <div className="hairline my-4" />
        <SummaryRow label="Subtotal" value={formatCents(quote.subtotalCents)} />
        {quote.discountCents > 0 && (
          <SummaryRow label={quote.discountLabel ?? "Discount"} value={`-${formatCents(quote.discountCents)}`} />
        )}
        <SummaryRow label="Tax" value={quote.taxCents > 0 ? formatCents(quote.taxCents) : "Included"} />
        <div className="hairline my-4" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-lg font-semibold text-white">{formatCents(quote.totalCents)}</span>
        </div>
        {quote.benefitNote && <p className="mt-3 text-xs text-white/50">{quote.benefitNote}</p>}
      </div>

      <div>
        <p className="label-tag mb-3">Payment method</p>
        <div className="rounded-lg border border-white/10 p-4 text-sm text-white/70">
          Card, via Paystack. You'll be redirected to complete payment securely.
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary flex-1 justify-center" disabled={busy}>
          Back
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onSubmit}
          className="btn-primary flex-1 justify-center disabled:opacity-60"
        >
          {busy ? "Processing…" : quote.totalCents === 0 ? "Activate free plan" : "Pay & Subscribe"}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-white/60">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

// --- Shared field components (matching get-a-quote.tsx's pattern) --------

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label-tag block">
        {label}
        {required && <span className="text-[var(--color-brand-green)]"> *</span>}
      </span>
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
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="label-tag block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white focus:border-[var(--color-brand-green)] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <span className="text-sm text-white/80">{label}</span>
    </label>
  );
}
