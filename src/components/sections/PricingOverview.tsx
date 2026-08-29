import { useState } from "react";
import { Link } from "@tanstack/react-router";

type TierCard = {
  name: string;
  price: string;
  cadence: string;
  who: string;
  credits: string;
  featured: boolean;
};

const AGENCY_TIERS: TierCard[] = [
  {
    name: "Basic",
    price: "From R700",
    cadence: "per month",
    who: "For businesses that need a professional always-available AI system handling one core function.",
    credits: "Includes R100 in free monthly usage credits.",
    featured: false,
  },
  {
    name: "Standard",
    price: "From R1,200",
    cadence: "per month",
    who: "For growing businesses with higher volumes or more complex requirements across one or more services.",
    credits: "Includes R200 to R300 in free monthly usage credits.",
    featured: true,
  },
  {
    name: "Premium",
    price: "From R2,500",
    cadence: "per month",
    who: "For businesses where the automated function is a primary revenue or operations channel.",
    credits: "Includes R300 to R400 in free monthly usage credits.",
    featured: false,
  },
];

// Real, current tiers - pulled from synkra-client-hub's src/lib/plans.ts.
// Update here if that file's PLAN_LIMITS prices ever change.
const FLOW_TIERS: TierCard[] = [
  {
    name: "Free Forever",
    price: "R0",
    cadence: "per month",
    who: "500 automation runs, 5 active workflows, 1 GB storage. No credit card required.",
    credits: "Pay-as-you-go for AI, SMS, voice, and WhatsApp add-ons.",
    featured: false,
  },
  {
    name: "Basic",
    price: "R149",
    cadence: "per month",
    who: "Higher run limits and included usage credits for growing automation needs.",
    credits: "Includes monthly AI, SMS, voice, and WhatsApp allocation.",
    featured: true,
  },
  {
    name: "Pro",
    price: "R249",
    cadence: "per month",
    who: "The highest run limits, storage, and included usage on Flow.",
    credits: "Includes the largest monthly AI, SMS, voice, and WhatsApp allocation.",
    featured: false,
  },
];

const TABS = [
  { key: "agency" as const, label: "Agency", tiers: AGENCY_TIERS, cta: { label: "View all services and pricing", to: "/services" as const, external: false } },
  { key: "flow" as const, label: "Flow", tiers: FLOW_TIERS, cta: { label: "Start with Synkra Flow", to: "https://client.synkra.co.za/checkout?plan=free", external: true } },
  { key: "chat" as const, label: "Chat", tiers: null, cta: { label: "Join the Chat waitlist", to: "/contact" as const, external: false } },
];

export default function PricingOverview() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("agency");
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">Pricing</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section">
              Transparent pricing. No long-term contracts. No surprises.
            </h2>
            <p className="body-text mt-6 max-w-[600px]">
              Agency pricing covers a setup fee, a monthly fee, and a free
              usage allocation. Flow is free to start, with paid plans as you
              grow. You never pay for what you do not use.
            </p>
            <div className="mt-8 flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActive(t.key)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active === t.key
                      ? "bg-[#56d722] text-[#0a0a0a] font-semibold"
                      : "border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tab.tiers ? (
          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tab.tiers.map((t) => (
              <div
                key={t.name}
                className={`relative rounded-2xl bg-[#0f0f0f] p-8 ${
                  t.featured
                    ? "border border-[#56d722]/60"
                    : "border border-white/5"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#56d722] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#0a0a0a]">
                    Most popular
                  </span>
                )}
                <h3 className="heading-card">{t.name}</h3>
                <div className="hairline mt-6" />
                <div className="mt-6">
                  <span className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                    {t.price}
                  </span>
                  <p className="mt-2 text-sm text-[#56d722]">{t.cadence}</p>
                </div>
                <p className="body-sm mt-8">{t.who}</p>
                <p className="label-tag mt-6">{t.credits}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-white/5 bg-[#0f0f0f] p-10">
            <p className="body-text max-w-[520px]">
              Synkra Chat is still in development. Pricing will follow the
              same self-serve model as Flow. Join the waitlist and we will
              let you know the moment plans are live.
            </p>
          </div>
        )}

        <div className="mt-12">
          {tab.cta.external ? (
            <a href={tab.cta.to} className="btn-secondary">
              {tab.cta.label}
            </a>
          ) : (
            <Link to={tab.cta.to as never} className="btn-secondary">
              {tab.cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
