import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { SERVICES, SERVICE_ORDER } from "@/data/services";

const TITLES: Record<string, string> = {
  "ai-voice-agent": "AI Voice Agent",
  "ai-web-widget": "AI Web Widget",
  "ai-whatsapp-agent": "AI WhatsApp Agent",
  "speed-to-lead": "Speed to Lead",
  "lead-reactivation": "Lead Reactivation",
  "ai-knowledge-base": "AI Knowledge Base",
  "automated-hiring": "Automated Hiring",
};

export const Route = createFileRoute("/services/")({
  head: () =>
    buildHead({
      title: "AI Automation Services",
      description:
        "Voice agents, WhatsApp agents, speed-to-lead, lead reactivation, knowledge bases, and automated hiring — built for South African businesses.",
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
            Seven focused systems that handle the work eating into your team's
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
