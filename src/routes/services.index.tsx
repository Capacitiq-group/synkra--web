import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { SERVICE_CONTENT } from "@/data/serviceContent";
import WaitlistForm from "@/components/WaitlistForm";

// Was reading from the orphaned src/data/services.ts (only ever consumed
// here, and only for the index cards — the real detail pages have always
// used SERVICE_CONTENT). Switched to the single source of truth so there
// is only one place to update a service's copy going forward.
// src/data/services.ts and src/components/sections/ServiceDetail.tsx are
// now unused - safe to delete.
const SERVICE_ORDER = [
  "ai-voice-agent",
  "speed-to-lead",
  "lead-reactivation",
  "custom-ai-systems",
] as const;

export const Route = createFileRoute("/services/")({
  head: () =>
    buildHead({
      title: "AI Automation Services for South African Businesses",
      description:
        "Synkra Technologies builds AI voice agents, speed to lead systems, lead reactivation, and custom AI systems for South African small businesses. Done for you, fully managed.",
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
            Four focused systems that handle the work eating into your team's
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
              const s = SERVICE_CONTENT[slug];
              return (
                <Link
                  key={slug}
                  to={`/services/${slug}` as never}
                  className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 transition-colors hover:border-white/15"
                >
                  <span className="numeral-sm absolute right-6 top-6 text-white/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="heading-card max-w-[80%]">{s.serviceLabel}</h2>
                  <p className="body-text mt-3">{s.subtitle}</p>
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
