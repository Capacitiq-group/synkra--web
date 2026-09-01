import { Link } from "@tanstack/react-router";
import type { ProductPageContent } from "@/data/productContent";
import WaitlistForm from "@/components/WaitlistForm";

function Divider() {
  return (
    <div className="container-main">
      <div className="hairline" />
    </div>
  );
}

export default function ProductPageLayout({ data }: { data: ProductPageContent }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag green-text text-left text-2xl font-light tracking-tight md:text-4xl">
            {data.number}
          </p>
          <h1 className="heading-display mt-6 max-w-[800px] text-left">{data.title}</h1>
          <p className="body-text mt-8 max-w-[600px] text-left text-lg">{data.subtitle}</p>
          <div className="mt-10">
            {data.status === "live" ? (
              <a href={data.cta.href} className="btn-primary">
                {data.cta.label}
              </a>
            ) : (
              <div className="max-w-[420px]">
                <p className="label-tag text-[var(--color-brand-green)]">In development</p>
                <WaitlistForm product={data.productLabel} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Divider />

      {/* Problem */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">The Problem</p>
          <h2 className="heading-section mt-6 max-w-[640px] text-left">{data.problem.heading}</h2>
          <p className="body-text mt-6 max-w-[580px] text-left">{data.problem.body}</p>
        </div>
      </section>

      <Divider />

      {/* Outcome */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">The Outcome</p>
          <h2 className="heading-section mt-6 max-w-[640px] text-left">{data.outcome.heading}</h2>
          <p className="body-text mt-6 max-w-[580px] text-left">{data.outcome.body}</p>
        </div>
      </section>

      <Divider />

      {/* Features */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">What's Included</p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/5 bg-[#0f0f0f] p-8">
                <h3 className="heading-card">{f.title}</h3>
                <p className="body-sm mt-3">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* How it works */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">How It Works</p>
          <div className="mt-10 border-t border-white/10">
            {data.steps.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-1 gap-6 border-b border-white/10 py-8 md:grid-cols-12 md:gap-10"
              >
                <div className="md:col-span-2">
                  <p className="numeral-sm text-white/80">{String(i + 1).padStart(2, "0")}</p>
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
        </div>
      </section>

      <Divider />

      {/* Pricing */}
      {data.pricing && (
        <>
          <section id="pricing-tiers" className="bg-[#0a0a0a]">
            <div className="container-main section-padding">
              <p className="label-tag text-left">Pricing</p>
              <h2 className="heading-section mt-6 max-w-[700px] text-left">{data.pricing.heading}</h2>
              <p className="body-text mt-6 max-w-[700px] text-left">{data.pricing.subtext}</p>

              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {data.pricing.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative rounded-2xl bg-[#0f0f0f] p-8 text-left ${
                      tier.featured ? "border border-[#56d722]/60" : "border border-white/5"
                    }`}
                  >
                    {tier.featured && (
                      <span className="absolute -top-3 left-8 rounded-full bg-[#56d722] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#0a0a0a]">
                        Most popular
                      </span>
                    )}
                    <h3 className="heading-card">{tier.name}</h3>
                    <div className="hairline mt-6" />
                    <div className="mt-6">
                      <span className="text-4xl font-semibold tracking-tight text-white">
                        {tier.price}
                      </span>
                      <p className="mt-2 text-sm text-[#56d722]">{tier.cadence}</p>
                    </div>
                    <p className="body-sm mt-8">{tier.who}</p>
                    <p className="label-tag mt-6 text-white/40">{tier.credits}</p>
                    <a
                      href={data.cta.href}
                      className="btn-primary mt-8 justify-center"
                    >
                      {data.cta.label}
                    </a>
                  </div>
                ))}
              </div>

              {data.pricing.studentNote && (
                <div className="mt-10 max-w-[700px] rounded-2xl border border-white/5 bg-[#0f0f0f] p-6 text-left">
                  <h3 className="heading-card text-lg">{data.pricing.studentNote.heading}</h3>
                  <p className="body-sm mt-3">{data.pricing.studentNote.body}</p>
                </div>
              )}
            </div>
          </section>
          <Divider />
        </>
      )}

      {/* Bottom CTA */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[640px] text-left">
            {data.status === "live"
              ? `Start with ${data.productLabel} today.`
              : `Be first to know when ${data.productLabel} opens.`}
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {data.status === "live" ? (
              <a href={data.cta.href} className="btn-primary">
                {data.cta.label}
              </a>
            ) : (
              <div className="w-full max-w-[420px]">
                <WaitlistForm product={data.productLabel} />
              </div>
            )}
            <Link to="/talk-to-us" search={{ service: data.productLabel } as never} className="btn-secondary">
              Talk to us first
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
