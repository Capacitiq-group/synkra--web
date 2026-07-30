import { Link } from "@tanstack/react-router";

const PRODUCTS = [
  {
    n: "01",
    name: "Synkra Flow",
    tag: "For businesses",
    body: "The AI systems that run inside your business. Voice agents, WhatsApp agents, web widgets, speed-to-lead, lead reactivation, and knowledge bases — built for how you actually operate, hosted and maintained by us.",
    points: [
      "Six production systems you can start with today",
      "Setup, hosting, and ongoing maintenance included",
      "From R700 per month with transparent usage rates",
    ],
    cta: { label: "Explore Synkra Flow", to: "/services" },
  },
  {
    n: "02",
    name: "Synkra Agency",
    tag: "For agencies and referrers",
    body: "The partner programme for agencies, consultants, and operators who want to sell AI automation without building or supporting any of it. We build it, you own the relationship.",
    points: [
      "Agency partners earn 35% recurring",
      "Referral partners earn 15% recurring",
      "White-label delivery and full technical support",
    ],
    cta: { label: "Explore Synkra Agency", to: "/partner" },
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
              Two products. One for businesses that want the systems, one for
              partners that want to sell them.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              <Link to={p.cta.to} className="arrow-link mt-5">
                {p.cta.label} <span className="arrow">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
