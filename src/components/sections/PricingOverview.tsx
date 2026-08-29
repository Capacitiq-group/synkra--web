import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AGENCY_TIERS, FLOW_TIERS } from "@/data/pricingTiers";

const TABS = [
  { key: "agency" as const, label: "Agency", tiers: AGENCY_TIERS, cta: { label: "View all services and pricing", to: "/services" as const, external: false } },
  { key: "flow" as const, label: "Flow", tiers: FLOW_TIERS, cta: { label: "Explore Synkra Flow", to: "/products/flow" as const, external: false } },
  { key: "chat" as const, label: "Chat", tiers: null, cta: { label: "Explore Synkra Chat", to: "/products/chat" as const, external: false } },
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
