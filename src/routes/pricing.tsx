import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ROILink from "@/components/sections/ROILink";

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildHead({
      title: "Pricing — Synkra",
      description:
        "Transparent setup fees, monthly retainers, and usage rates for every Synkra AI service. No contracts, no surprises.",
      path: "/pricing",
    }),
  component: PricingPage,
});

type ServiceRow = {
  name: string;
  slug: string;
  monthlyFrom: string;
  setupFrom: string;
};

// Matches each service's actual pricing.mode in serviceContent.ts - the
// three "simple" services show one starting price, Custom Agentic AI's
// figures are its Essential (lowest) tier. Full detail lives on each
// service's own page, this table is a starting-price comparison only.
const SERVICE_ROWS: ServiceRow[] = [
  { name: "AI Voice Agent", slug: "ai-voice-agent", monthlyFrom: "R700/month", setupFrom: "R2,500" },
  { name: "Speed to Lead", slug: "speed-to-lead", monthlyFrom: "R700/month", setupFrom: "R3,000" },
  { name: "Lead Reactivation", slug: "lead-reactivation", monthlyFrom: "R800/month", setupFrom: "R3,500" },
  { name: "Custom Agentic AI", slug: "custom-agentic-ai", monthlyFrom: "R1,500/month", setupFrom: "R5,000" },
];

const USAGE_ROWS: { what: string; rate: string }[] = [
  { what: "Voice call minutes", rate: "R5.00 per minute" },
  { what: "Additional phone numbers", rate: "R35.00 per month each" },
  { what: "WhatsApp replies (customer initiated)", rate: "R0.50 per conversation" },
  { what: "WhatsApp broadcasts (business initiated)", rate: "R1.50 per conversation" },
  { what: "Web widget words generated", rate: "R1.50 per 1,000 words" },
  { what: "Knowledge base queries", rate: "R2.00 to R4.00 per 1,000 queries" },
  { what: "SMS messages", rate: "R0.90 per message" },
  { what: "CV screening (hiring system)", rate: "Included in plan" },
];

const FAQS: { q: string; a: string }[] = [
  { q: "Do I have to sign a long-term contract?", a: "No. There are no long-term contracts on any Synkra service. Your monthly retainer runs month to month and you can pause or cancel at any time from your client portal with effect from your next billing date." },
  { q: "What happens if I want to cancel?", a: "You cancel directly from your client portal in a few steps. Your service remains fully active until your next billing date. You have until the day before that date to change your mind and reverse the cancellation. Once it takes effect your service stops, your data is retained for 90 days, and then permanently deleted." },
  { q: "Can I pause my service instead of cancelling?", a: "Yes. Pausing keeps your service exactly as built on our infrastructure while stopping it from taking calls or messages. Your monthly retainer continues during a pause because we are still hosting and maintaining your system. You can resume with one click and your service is live again immediately." },
  { q: "What happens to my credits if I cancel?", a: "Any remaining credits in your account are forfeited when your service cancels. Credits are non-refundable under any circumstances. If you return after cancellation you pay a new setup fee and start with a fresh credit balance." },
  { q: "Can I upgrade my plan after I start?", a: "Yes. You can upgrade your monthly plan at any time from your client portal. The difference in monthly fee is prorated from the upgrade date. Upgrading your plan does not require a new setup fee." },
  { q: "Are there any hidden costs I should know about?", a: "No. Every cost is shown on this page. You pay a setup fee once, a monthly retainer that includes your free credit allocation, and usage charges only when you exceed that allocation. The only variable is how much your business uses the service each month." },
  { q: "Do you offer global pricing?", a: "Yes. All pricing shown on this page is in South African Rand for South African clients. Global clients are billed in USD. Contact us for global pricing on any service." },
  { q: "What payment methods do you accept?", a: "We accept card payments via Paystack for setup fees and credit top-ups. Monthly retainers can be paid by card or EFT. All payments are processed securely and receipts are available in your client portal." },
];


function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <h3 className="heading-card">{q}</h3>
        <span className="mt-1 text-2xl leading-none text-[#56d722]">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: open ? 600 : 0 }}
      >
        <p className="body-sm pb-6 pr-10 text-white/70">{a}</p>
      </div>
    </div>
  );
}

function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#0a0a0a]">
      {/* HERO */}
      <section className="container-main section-padding">
        <p className="label-tag">Pricing</p>
        <h1 className="heading-display mt-6 max-w-[1000px]">
          Transparent pricing. No contracts. No surprises.
        </h1>
        <p className="body-text mt-8 max-w-[600px]">
          Every Synkra service has a once-off setup fee and a monthly retainer
          that includes a free credit allocation. You only pay for what you use
          beyond that — and you can cancel any time.
        </p>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* HOW THE CREDIT SYSTEM WORKS */}
      <section className="container-main section-padding">
        <p className="label-tag">How It Works</p>
        <h2 className="heading-section mt-6 max-w-[640px]">
          You top up credits. Your system uses them. You never get an unexpected
          bill.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              step: "Step One",
              title: "Pay your setup fee and monthly retainer.",
              body: "Your setup fee is a once-off payment that covers the build. Your monthly retainer covers hosting, maintenance, and loads your free monthly credit allocation automatically.",
            },
            {
              step: "Step Two",
              title: "Your free credits are used first.",
              body: "Every month your plan loads a free credit allocation. These are used before any paid credits and reset each billing month. Unused free credits do not roll over.",
            },
            {
              step: "Step Three",
              title: "Top up when you need more.",
              body: "When your free allocation runs out you top up directly from your client portal. Paid credits roll over for six months from the date of purchase and never expire before then.",
            },
          ].map((c) => (
            <div key={c.step} className="card-dark p-8">
              <p className="label-tag text-[#56d722]">{c.step}</p>
              <h3 className="heading-card mt-4">{c.title}</h3>
              <p className="body-sm mt-4 text-white/60">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="body-sm mt-8 text-white/40">
          All payments are non-refundable. Services can be paused or cancelled
          from your client portal at any time with effect from your next billing
          date.
        </p>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* PER-SERVICE PRICING */}
      <section className="container-main section-padding">
        <p className="label-tag">Monthly Plans</p>
        <h2 className="heading-section mt-6 max-w-[640px]">
          Each service is priced on its own. There is no generic plan that
          applies across everything.
        </h2>
        <p className="body-text mt-6 max-w-[580px]">
          AI Voice Agent, Speed to Lead, and Lead Reactivation each have one
          straightforward monthly price plus a setup fee that depends on
          complexity. Custom Agentic AI is scoped in three tiers since the
          work itself varies far more from client to client. Usage beyond
          your included allowance is metered — R5 per call minute, R0.50 per
          WhatsApp reply, and R1.50 per broadcast message, the same rate
          regardless of which service you use.
        </p>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* SETUP FEES BY SERVICE */}
      <section className="container-main section-padding">
        <p className="label-tag">Pricing By Service</p>
        <h2 className="heading-section mt-6 max-w-[640px]">
          Starting prices for every Agency service.
        </h2>
        <p className="body-text mt-6 max-w-[580px]">
          Setup fees vary by complexity, integrations, and configuration
          requirements. The numbers below are starting points — open a
          service page for the full picture, or request a quote for an
          exact number based on your business.
        </p>

        <div className="mt-12 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-white/10">
                {["Service", "Setup From", "Monthly From"].map(
                  (h) => (
                    <th
                      key={h}
                      className="label-tag py-4 pr-4 font-medium text-white/40"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {SERVICE_ROWS.map((r) => (
                <tr key={r.slug} className="border-b border-white/10">
                  <td className="body-sm py-5 pr-4">
                    <Link
                      to={`/services/${r.slug}` as string as "/services"}
                      className="text-[#56d722] hover:underline"
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="body-sm py-5 pr-4 text-white/80">{r.setupFrom}</td>
                  <td className="body-sm py-5 pr-4 text-white/80">{r.monthlyFrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* USAGE RATES */}
      <section className="container-main section-padding">
        <p className="label-tag">Usage Rates</p>
        <h2 className="heading-section mt-6 max-w-[560px]">
          What you pay beyond your free monthly allocation.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="label-tag py-4 pr-4 font-medium text-white/40">
                    What Is Being Used
                  </th>
                  <th className="label-tag py-4 pr-4 font-medium text-white/40">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {USAGE_ROWS.map((u) => (
                  <tr key={u.what} className="border-b border-white/10">
                    <td className="body-sm py-5 pr-4 text-white/80">{u.what}</td>
                    <td className="body-sm py-5 pr-4 text-white/80">{u.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-dark p-8">
            <p className="label-tag text-[#56d722]">How Credits Work In Practice</p>
            <p className="body-sm mt-4 text-white/60">
              Your free monthly allocation is consumed first every month. Once
              it runs out your paid credit balance is consumed. You receive a
              low balance notification when your credits drop below R50. When
              your balance reaches zero your service pauses automatically and
              resumes the moment you top up. Any call already in progress when
              your balance reaches zero will complete. The small overage this
              creates is recovered from your next top-up.
            </p>
            <div className="hairline my-6" />
            <p className="label-tag text-[#56d722]">Paid Credit Expiry</p>
            <p className="body-sm mt-4 text-white/60">
              Paid credits roll over for six months from the date of purchase.
              Free monthly credits do not roll over and reset each billing
              month. All credits are non-refundable.
            </p>
          </div>
        </div>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* ROI LINK */}
      <ROILink />

      {/* COMMON QUESTIONS */}
      <section className="container-main section-padding">
        <p className="label-tag">Common Questions</p>
        <h2 className="heading-section mt-6 max-w-[560px]">
          Everything you need to know before you commit to anything.
        </h2>

        <div className="mt-12 max-w-[840px] border-t border-white/10">
          {FAQS.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      <div className="container-main"><div className="hairline" /></div>

      {/* BOTTOM CTA */}
      <section className="container-main section-padding">
        <h2 className="heading-section max-w-[600px]">
          Not sure which service or plan is right for your business?
        </h2>
        <p className="body-text mt-6 max-w-[540px]">
          Get in touch and we will look at your specific situation and tell you
          exactly what we would recommend and why. No obligation, no sales
          pressure.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/talk-to-us" className="btn-primary justify-center">
            Talk to us
          </Link>
          <Link to="/services" className="btn-secondary justify-center">
            See all services
          </Link>
        </div>
      </section>
    </div>
  );
}
