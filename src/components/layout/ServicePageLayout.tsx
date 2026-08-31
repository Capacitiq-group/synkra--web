import { Link } from "@tanstack/react-router";
import type { ServicePageContent } from "@/data/serviceContent";

function Divider() {
  return (
    <div className="container-main">
      <div className="hairline" />
    </div>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageContent }) {

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag green-text text-left text-2xl font-light tracking-tight md:text-4xl">
            {data.number}
          </p>
          <h1 className="heading-display mt-6 max-w-[800px] text-left">
            {data.title}
          </h1>
          <p className="body-text mt-8 max-w-[600px] text-left text-lg">
            {data.subtitle}
          </p>
        </div>
      </section>

      <Divider />

      {/* Problem */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">The Problem</p>
          <h2 className="heading-section mt-6 max-w-[640px] text-left">
            {data.problem.heading}
          </h2>
          <p className="body-text mt-6 max-w-[580px] text-left">
            {data.problem.body}
          </p>
        </div>
      </section>

      <Divider />

      {/* Outcome */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">The Outcome</p>
          <h2 className="heading-section mt-6 max-w-[640px] text-left">
            {data.outcome.heading}
          </h2>
          <p className="body-text mt-6 max-w-[580px] text-left">
            {data.outcome.body}
          </p>
          <a href="#pricing-tiers" className="arrow-link mt-8 inline-flex">
            See which plan fits your business <span className="arrow">→</span>
          </a>
        </div>
      </section>

      <Divider />

      {/* ROI Link */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="text-left">
              <h3 className="heading-card max-w-[480px]">{data.roiHeading}</h3>
            </div>
            <div className="text-left">
              <p className="body-sm max-w-[480px]">
                Use the calculator to put a real number on what this service is
                worth to your business each month.
              </p>
              <Link to="/roi-calculator" className="arrow-link mt-4 inline-flex">
                Open the ROI Calculator <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Pricing */}
      <section id="pricing-tiers" className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">Pricing</p>
          <h2 className="heading-section mt-6 max-w-[700px] text-left">
            {data.pricing.heading}
          </h2>

          {data.pricing.mode === "simple" ? (
            <div className="mt-12 max-w-[520px]">
              <div className="card-dark text-left">
                <p className="display-sm">{data.pricing.fromMonthly}</p>
                <p className="body-sm mt-3 text-white/60">{data.pricing.monthlyNote}</p>
                <div className="hairline my-6" />
                <p className="heading-card">{data.pricing.fromSetup}</p>
                <p className="body-sm mt-3 text-white/60">{data.pricing.setupNote}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/talk-to-us"
                    search={{ service: data.serviceLabel } as never}
                    className="btn-secondary justify-center"
                  >
                    Talk to us first
                  </Link>
                  <Link
                    to="/contact"
                    search={{ service: data.serviceLabel } as never}
                    className="btn-primary justify-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="body-text mt-6 max-w-[700px] text-left">
                {data.pricing.subtext}
              </p>
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {data.pricing.tiers.map((tier) => {
                  const contactSearch = {
                    service: data.serviceLabel,
                    tier: tier.name,
                  };
                  return (
                    <div
                      key={tier.name}
                      className="card-dark flex flex-col text-left"
                    >
                      <h3 className="heading-card">{tier.name}</h3>
                      <p className="label-tag mt-3">{tier.setup}</p>
                      <p className="display-sm mt-2">{tier.monthly}</p>
                      <p className="body-sm mt-4">{tier.description}</p>
                      {tier.allocation && (
                        <p className="label-tag mt-4 text-white/40">
                          {tier.allocation}
                        </p>
                      )}
                      <div className="mt-8 flex flex-col gap-3">
                        <Link
                          to="/contact"
                          search={contactSearch as never}
                          className="btn-secondary justify-center"
                        >
                          Add to Quote
                        </Link>
                        <Link
                          to="/contact"
                          search={contactSearch as never}
                          className="btn-primary justify-center"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <Divider />

      {/* After checkout */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">After You Pay</p>
          <h2 className="heading-section mt-6 max-w-[700px] text-left">
            {data.afterCheckout.heading}
          </h2>
          <p className="body-text mt-6 max-w-[640px] text-left">
            {data.afterCheckout.body}
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            {data.afterCheckout.ctaLabel}
          </Link>
        </div>
      </section>

      <Divider />

      {/* Bottom CTA */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[640px] text-left">
            {data.bottomCTA.heading}
          </h2>
          <p className="body-text mt-6 max-w-[580px] text-left">
            {data.bottomCTA.body}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
            <Link to="/talk-to-us" search={{ service: data.serviceLabel } as never} className="btn-secondary">
              Talk to us first
            </Link>
          </div>
        </div>
      </section>

      {/* Brochure link */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main pb-8">
          <a
            href={data.brochure}
            className="body-sm green-text inline-flex items-center gap-2 text-left underline-offset-4 hover:underline"
          >
            Download the full service brochure →
          </a>
        </div>
      </section>
    </>
  );
}
