import { Link } from "@tanstack/react-router";

const TIERS = [
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

export default function PricingOverview() {
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
              Every service has a once-off setup fee and a monthly fee that
              covers hosting, maintenance, and a free usage allocation. You
              top up credits when you need more capacity and you never pay
              for what you do not use.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
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

        <div className="mt-12">
          <Link to="/services" className="btn-secondary">
            View all services and pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
