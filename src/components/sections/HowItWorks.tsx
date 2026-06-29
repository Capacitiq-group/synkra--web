import { Link } from "@tanstack/react-router";

const STEPS = [
  {
    n: "01",
    title: "You pay the setup fee",
    body: "Directly on our website or we send you a quote if you want to talk first. Either way the process starts the moment payment clears.",
  },
  {
    n: "02",
    title: "We run your onboarding call",
    body: "Within 24 hours of payment we are on a call. We learn your business, agree on exactly what we are building, and confirm the timeline.",
  },
  {
    n: "03",
    title: "We build and you approve",
    body: "We build your system, you test it, and nothing goes live until you are completely satisfied with how it represents your business.",
  },
  {
    n: "04",
    title: "You go live",
    body: "Your system goes live and your client portal is active. You can monitor everything, manage your credits, and submit changes at any time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">How It Works</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section">
              From payment to live in under two weeks.
            </h2>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="grid grid-cols-1 gap-6 border-b border-white/10 py-10 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-2">
                <p className="numeral-sm text-white/80">{s.n}</p>
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

        <div className="mt-12">
          <Link to="/contact" className="btn-primary">
            Get your first system live within two weeks
          </Link>
        </div>
      </div>
    </section>
  );
}
