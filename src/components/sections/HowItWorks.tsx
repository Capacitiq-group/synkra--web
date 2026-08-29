import { useState } from "react";
import { Link } from "@tanstack/react-router";

type Step = { n: string; title: string; body: string };
type Tab = {
  key: "agency" | "flow" | "chat";
  label: string;
  heading: string;
  steps: Step[];
  cta: { label: string; to: string; external: boolean };
};

const TABS: Tab[] = [
  {
    key: "agency",
    label: "Agency",
    heading: "From payment to a live system within 48 hours of onboarding.",
    steps: [
      {
        n: "01",
        title: "You pay the setup fee",
        body: "Directly on our website or we send you a quote if you want to talk first. Either way the process starts the moment payment clears.",
      },
      {
        n: "02",
        title: "We run your onboarding call",
        body: "Within 24 hours of payment we are on a call. We learn your business, agree on exactly what we are building, and confirm the timeline.",
      },
      {
        n: "03",
        title: "We build and you approve",
        body: "Once onboarding is complete we build your system, you test it, and nothing goes live until you are completely satisfied with how it represents your business. Most builds are live within 48 hours of onboarding, longer for more complex requirements.",
      },
      {
        n: "04",
        title: "You go live",
        body: "Your system goes live and your client portal is active. You can monitor everything, manage your credits, and submit changes at any time.",
      },
    ],
    cta: { label: "Start your onboarding", to: "/contact", external: false },
  },
  {
    key: "flow",
    label: "Flow",
    heading: "From checkout to your first automation in minutes.",
    steps: [
      {
        n: "01",
        title: "Check out",
        body: "Pick a plan, starting with Free Forever. No credit card required to start.",
      },
      {
        n: "02",
        title: "Create your account",
        body: "Create your account and log in to your Flow portal.",
      },
      {
        n: "03",
        title: "Start from a template",
        body: "Activate one of our pre-built templates or start from scratch with the visual builder.",
      },
      {
        n: "04",
        title: "Connect your tools",
        body: "Integrate the platforms you already use and publish your first workflow.",
      },
    ],
    cta: {
      label: "Start with Synkra Flow",
      to: "/products/flow",
      external: false,
    },
  },
  {
    key: "chat",
    label: "Chat",
    heading: "Same self-serve setup as Flow, coming soon.",
    steps: [
      {
        n: "01",
        title: "Check out",
        body: "Pick a plan once Chat is available. Same account and billing as Flow.",
      },
      {
        n: "02",
        title: "Create your account",
        body: "Create your account and log in to your Chat portal.",
      },
      {
        n: "03",
        title: "Set up your AI",
        body: "Configure how your AI responds and what it knows about your business.",
      },
      {
        n: "04",
        title: "Go live",
        body: "Connect it to your customer channels and you are live.",
      },
    ],
    cta: { label: "Join the Chat waitlist", to: "/products/chat", external: false },
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState<Tab["key"]>("agency");
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">How It Works</p>
            <div className="mt-6 flex gap-2">
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
          <div className="lg:col-span-8">
            <h2 className="heading-section">{tab.heading}</h2>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10">
          {tab.steps.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-1 gap-6 border-b border-white/10 py-10 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-2">
                <p className="numeral-sm text-white/80">{s.n}</p>
              </div>
              <div className="md:col-span-4">
                <h3 className="heading-card">{s.title}</h3>
              </div>
              <div className="md:col-span-6">
                <p className="body-text">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          {tab.cta.external ? (
            <a href={tab.cta.to} className="btn-primary">
              {tab.cta.label}
            </a>
          ) : (
            <Link to={tab.cta.to as never} className="btn-primary">
              {tab.cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
