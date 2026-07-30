import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { joinWaitlist } from "@/lib/public.functions";
import { buildHead } from "@/lib/seo";
import { SERVICES, SERVICE_ORDER } from "@/data/services";

const TITLES: Record<string, string> = {
  "ai-voice-agent": "AI Voice Agent",
  "ai-web-widget": "AI Web Widget",
  "ai-whatsapp-agent": "AI WhatsApp Agent",
  "speed-to-lead": "Speed to Lead",
  "lead-reactivation": "Lead Reactivation",
  "ai-knowledge-base": "AI Knowledge Base",
};

export const Route = createFileRoute("/services/")({
  head: () =>
    buildHead({
      title: "AI Automation Services",
      description:
        "Voice agents, WhatsApp agents, web widgets, speed-to-lead, lead reactivation, and knowledge bases — built for South African businesses.",
      path: "/services",
    }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag">Services</p>
          <h1 className="heading-display mt-6 max-w-[900px]">
            AI systems built around how your business actually runs.
          </h1>
          <p className="body-text mt-8 max-w-[640px] text-lg">
            Six focused systems that handle the work eating into your team's
            day. Pick one, layer in the rest as you grow.
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICE_ORDER.map((slug, i) => {
              const s = SERVICES[slug];
              return (
                <Link
                  key={slug}
                  to={`/services/${slug}` as never}
                  className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 transition-colors hover:border-white/15"
                >
                  <span className="numeral-sm absolute right-6 top-6 text-white/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="heading-card max-w-[80%]">{TITLES[slug]}</h2>
                  <p className="body-text mt-3">{s.short}</p>
                  <div className="hairline mt-8" />
                  <span className="arrow-link mt-5">
                    Learn more <span className="arrow">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <p className="label-tag">Coming Next</p>
          <h2 className="heading-section mt-6 max-w-[620px]">
            Systems we are building next. Join the list and you get first
            access.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {COMING_NEXT.map((c) => (
              <div
                key={c.name}
                className="flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8"
              >
                <p className="label-tag text-[var(--color-brand-green)]">
                  In development
                </p>
                <h3 className="heading-card mt-4">{c.name}</h3>
                <p className="body-text mt-3">{c.body}</p>
                <div className="hairline mt-8" />
                <WaitlistForm product={c.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="max-w-[820px]">
            <h2 className="heading-display">
              Not sure which one fits your business?
            </h2>
            <p className="body-text mt-8 max-w-[600px]">
              Book a 30-minute discovery call. We will look at your current
              workflow, identify where automation pays back fastest, and
              recommend the right starting point.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/contact" className="btn-primary justify-center">
                Book a Discovery Call
              </Link>
              <Link to="/roi-calculator" className="btn-secondary justify-center">
                Calculate your ROI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const COMING_NEXT = [
  {
    name: "AI Sales Agent",
    body: "An agent that runs your outbound follow-up sequences across call, WhatsApp, and email until the lead books or opts out.",
  },
  {
    name: "AI Support Desk",
    body: "A support layer that resolves routine tickets end to end and escalates only what genuinely needs a person.",
  },
] as const;

function WaitlistForm({ product }: { product: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await joinWaitlist({ data: { email: email.trim(), product } });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="body-sm mt-6 text-[var(--color-brand-green)]">
        You are on the list. We will be in touch the moment it is ready.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-brand-green)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-primary justify-center whitespace-nowrap disabled:opacity-60"
      >
        {state === "sending" ? "Adding..." : "Join waitlist"}
      </button>
      {state === "error" && (
        <p className="body-sm text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
