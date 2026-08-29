import { Link } from "@tanstack/react-router";

const PRODUCTS = [
  {
    n: "01",
    name: "Synkra Agency",
    tag: "Done for you",
    body: "The AI systems that run inside your business, built and managed by our team. Voice agents, speed-to-lead, lead reactivation, and custom agentic AI, hosted and maintained for you.",
    points: [
      "Four production systems you can start with today",
      "Setup, hosting, and ongoing maintenance included",
      "From R700 per month with transparent usage rates",
    ],
    cta: { label: "Explore Synkra Agency", to: "/services" as const, external: false },
  },
  {
    n: "02",
    name: "Synkra Flow",
    tag: "Build it yourself",
    body: "A self-serve automation builder. Start free, build your own workflows from templates, and connect the tools you already use.",
    points: [
      "Free Forever plan, no credit card required",
      "Paid plans from R149 per month",
      "Templates to get your first automation running in minutes",
    ],
    cta: {
      label: "Start with Synkra Flow",
      to: "/products/flow" as const,
      external: false,
    },
  },
  {
    n: "03",
    name: "Synkra Chat",
    tag: "Coming soon",
    body: "A self-serve AI chat platform for your business, built on the same infrastructure as Flow. Join the waitlist and we will let you know the moment it opens.",
    points: [
      "Built for how South African businesses already use WhatsApp",
      "Same account, same billing as Synkra Flow",
      "First access goes to the waitlist",
    ],
    cta: { label: "Join the Chat waitlist", to: "/products/chat" as const, external: false },
  },
] as const;

export default function Products() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">What We Offer</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section max-w-3xl">
              Three ways to get AI working in your business, done for you or
              built by you.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 lg:p-10"
            >
              <span className="numeral-sm absolute right-6 top-6 text-white/15">
                {p.n}
              </span>
              <p className="label-tag text-[var(--color-brand-green)]">
                {p.tag}
              </p>
              <h3 className="heading-card mt-4 max-w-[80%]">{p.name}</h3>
              <p className="body-text mt-4">{p.body}</p>
              <ul className="mt-8 space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-white/70">
                    <span className="text-[var(--color-brand-green)]">—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="hairline mt-10" />
              {p.cta.external ? (
                <a href={p.cta.to} className="arrow-link mt-5">
                  {p.cta.label} <span className="arrow">→</span>
                </a>
              ) : (
                <Link to={p.cta.to} className="arrow-link mt-5">
                  {p.cta.label} <span className="arrow">→</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
