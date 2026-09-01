import { Link } from "@tanstack/react-router";
import WaitlistForm from "@/components/WaitlistForm";
import type { IndustryPageContent } from "@/data/industryContent";

function Divider() {
  return (
    <div className="container-main">
      <div className="hairline" />
    </div>
  );
}

export default function IndustryPageLayout({
  data,
}: {
  data: IndustryPageContent;
}) {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag green-text text-left text-2xl font-light tracking-tight md:text-4xl">
            {data.number}
          </p>
          <p className="label-tag mt-6 text-left">{data.label}</p>
          <h1 className="heading-section mt-4 max-w-[900px] text-left">
            {data.title}
          </h1>
        </div>
      </section>

      <Divider />

      {/* Problem */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">{data.problem.heading}</p>
          <div className="mt-6 max-w-[680px] space-y-6">
            {data.problem.body.map((para) => (
              <p key={para.slice(0, 24)} className="body-text text-left">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* What we configure */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">What we configure</p>
          <h2 className="heading-section mt-6 max-w-[680px] text-left">
            {data.configure.heading}
          </h2>
          <p className="body-text mt-6 max-w-[680px] text-left">
            {data.configure.body}
          </p>
        </div>
      </section>

      <Divider />

      {/* How this connects */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">{data.connects.heading}</p>
          <p className="body-text mt-6 max-w-[680px] text-left">
            {data.connects.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/services" className="arrow-link">
              Agency services <span className="arrow">→</span>
            </Link>
            <Link to="/products/flow" className="arrow-link">
              Synkra Flow <span className="arrow">→</span>
            </Link>
            <Link to="/products/chat" className="arrow-link">
              Synkra Chat <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="card-dark max-w-[720px]">
            <h2 className="heading-card text-left">{data.cta.label}</h2>
            <p className="body-sm mt-3 text-left">
              Tell us how your business actually runs and we will tell you
              honestly whether this fits.
            </p>
            <Link to="/contact" className="btn-primary mt-6">
              {data.cta.label} <span aria-hidden>→</span>
            </Link>

            <div className="divider my-8" />

            <p className="label-tag text-left">Early access</p>
            <p className="body-sm mt-3 text-left">
              Join early access for launch updates and a launch discount.
            </p>
            <WaitlistForm product={`industry-${data.slug}`} />
          </div>
        </div>
      </section>
    </>
  );
}
