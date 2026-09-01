import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildHead({
      title: "About Synkra",
      description:
        "Synkra is a South African AI automation company built to make automation affordable for every business, not just enterprises.",
      path: "/about",
    }),
  component: AboutPage,
});

function Divider() {
  return (
    <div className="container-main">
      <div className="hairline" />
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">About Synkra</p>
          <h1 className="heading-display mt-6 max-w-[800px] text-left">
            We built Synkra because automation should not be something only large
            businesses can afford.
          </h1>
          <p className="body-text mt-8 max-w-[620px] text-left text-lg">
            Most AI automation companies price their services for enterprises.
            We built ours for the businesses that need it most: the clinic
            missing calls after hours, the estate agent losing leads to faster
            competitors, the small logistics company drowning in WhatsApp
            messages with a two-person team.
          </p>
        </div>
      </section>

      <Divider />

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="text-left">
              <h2 className="heading-section max-w-[480px]">
                How we are different
              </h2>
            </div>
            <div className="text-left">
              <p className="body-text max-w-[560px]">
                Most companies in this space resell a platform built by
                someone else, with their own name on top. Synkra builds the
                automation itself. That's the reason pricing can work for a
                business doing R500,000 a year, not only one doing R50
                million. There's no vendor markup sitting between what you
                pay and what it costs to run.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[640px] text-left">
            What we believe
          </h2>
          <p className="body-text mt-6 max-w-[600px] text-left">
            An AI system working 24 hours a day, 7 days a week, should cost less
            than one employee working 8 hours a day, 5 days a week. That is not
            a marketing line. It is the standard we hold ourselves to with every
            service we price and every system we build.
          </p>
        </div>
      </section>

      <Divider />

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[640px] text-left">
            Who is behind Synkra
          </h2>
          <p className="body-text mt-6 max-w-[600px] text-left">
            Synkra is a South African automation company built by a focused team
            that builds well, moves fast, and stands behind everything we
            deliver. We do not have a large office or a large team. We have the
            right people and a straightforward commitment to making automation
            accessible to every business that needs it.
          </p>
        </div>
      </section>

      <Divider />

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[560px] text-left">
            If you are ready to automate the parts of your business that are
            costing you the most time and money, we are ready to build it.
          </h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
            <Link to="/services" className="btn-secondary">
              See our services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
