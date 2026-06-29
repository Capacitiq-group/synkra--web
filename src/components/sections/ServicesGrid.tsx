import { Link } from "@tanstack/react-router";

const SERVICES = [
  {
    n: "01",
    title: "AI Voice Agent",
    body: "Your phones answered and your appointments booked at any hour without involving your team.",
    to: "/services/ai-voice-agent",
  },
  {
    n: "02",
    title: "AI Web Widget",
    body: "Your website visitors converted into booked clients before they leave the page.",
    to: "/services/ai-web-widget",
  },
  {
    n: "03",
    title: "AI WhatsApp Agent",
    body: "Every WhatsApp message your business receives answered instantly without your team typing a single response.",
    to: "/services/ai-whatsapp-agent",
  },
  {
    n: "04",
    title: "Speed to Lead",
    body: "Every new lead called within 90 seconds of submitting a form, before your competitors have seen the notification.",
    to: "/services/speed-to-lead",
  },
  {
    n: "05",
    title: "Lead Reactivation",
    body: "Booked meetings from the dormant contacts already sitting in your database.",
    to: "/services/lead-reactivation",
  },
  {
    n: "06",
    title: "AI Knowledge Base",
    body: "Every question your team has about your business answered in seconds from a system that knows everything in your documents.",
    to: "/services/ai-knowledge-base",
  },
  {
    n: "07",
    title: "Automated Hiring System",
    body: "Your applicant pool screened and your shortlist built without your team reading a single CV manually.",
    to: "/services/automated-hiring",
  },
] as const;

export default function ServicesGrid() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">What We Build</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section max-w-3xl">
              Six systems. Every one of them solving a problem your business is
              dealing with right now.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((s) => (
            <article
              key={s.n}
              className="relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8"
            >
              <span className="numeral-sm absolute right-6 top-6 text-white/15">
                {s.n}
              </span>
              <h3 className="heading-card max-w-[80%]">{s.title}</h3>
              <p className="body-text mt-3">{s.body}</p>
              <div className="hairline mt-8" />
              <Link to={s.to} className="arrow-link mt-5">
                Learn more <span className="arrow">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
