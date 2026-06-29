import { Link } from "@tanstack/react-router";

export type ServiceData = {
  eyebrow: string;
  title: string;
  intro: string;
  problem: { heading: string; body: string };
  features: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  outcomes: string[];
  pricing: { from: string; note: string };
};

export default function ServiceDetail({ data }: { data: ServiceData }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag">{data.eyebrow}</p>
          <h1 className="heading-display mt-6 max-w-[900px]">{data.title}</h1>
          <p className="body-text mt-8 max-w-[640px] text-lg">{data.intro}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary justify-center">
              Book a Discovery Call
            </Link>
            <Link to="/pricing" className="btn-secondary justify-center">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label-tag">The Problem</p>
            </div>
            <div className="lg:col-span-8">
              <h2 className="heading-section max-w-3xl">
                {data.problem.heading}
              </h2>
              <p className="body-text mt-6 max-w-2xl">{data.problem.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label-tag">What You Get</p>
              <h2 className="heading-section mt-6">
                Built around how your business actually runs.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-6 md:grid-cols-2">
                {data.features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/5 bg-[#0f0f0f] p-6"
                  >
                    <h3 className="heading-card">{f.title}</h3>
                    <p className="body-text mt-3">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label-tag">How It Works</p>
              <h2 className="heading-section mt-6">
                From kickoff to live in weeks, not months.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ol className="divide-y divide-white/10 border-y border-white/10">
                {data.steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="grid grid-cols-[auto_1fr] gap-6 py-6 md:grid-cols-[80px_1fr]"
                  >
                    <span className="numeral-sm text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="heading-card">{s.title}</h3>
                      <p className="body-text mt-2">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="label-tag">Outcomes</p>
              <h2 className="heading-section mt-6">
                What changes once it is running.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-4">
                {data.outcomes.map((o) => (
                  <li key={o} className="flex gap-4">
                    <span className="green-text mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                    <span className="body-text text-white/85">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing + CTA */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="rounded-[2rem] border border-white/5 bg-[#141320] p-10 md:p-14">
            <div className="grid gap-10 md:grid-cols-2 md:items-end">
              <div>
                <p className="label-tag">Investment</p>
                <p className="mt-4 text-white/70">From</p>
                <p className="display-sm mt-1 text-white">{data.pricing.from}</p>
                <p className="body-sm mt-3 max-w-md">{data.pricing.note}</p>
              </div>
              <div className="md:text-right">
                <h3 className="heading-section">Ready to put this in place?</h3>
                <div className="mt-6 flex flex-col gap-3 md:items-end">
                  <Link to="/contact" className="btn-primary justify-center">
                    Book a Discovery Call
                  </Link>
                  <Link to="/roi-calculator" className="arrow-link">
                    Calculate your ROI <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
