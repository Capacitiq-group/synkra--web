import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { INDUSTRY_LIST } from "@/data/industryContent";

export const Route = createFileRoute("/industries/")({
  head: () =>
    buildHead({
      title: "Industries We Build AI Systems For, Synkra Technologies",
      description:
        "Synkra Technologies configures AI voice agents and workflow automation for South African trades, medical, education, legal, logistics, and hospitality businesses.",
      path: "/industries",
    }),
  component: IndustriesIndex,
});

function IndustriesIndex() {
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag">Industries</p>
          <h1 className="heading-display mt-6 max-w-[900px]">
            Configured around how your industry actually operates.
          </h1>
          <p className="body-text mt-8 max-w-[640px] text-lg">
            The same underlying systems, set up differently depending on who is
            calling you, what they need, and what happens after the call.
          </p>
        </div>
      </section>

      <div className="container-main">
        <div className="hairline" />
      </div>

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="grid gap-6 md:grid-cols-2">
            {INDUSTRY_LIST.map((industry) => (
              <Link
                key={industry.slug}
                to="/industries/$slug"
                params={{ slug: industry.slug }}
                className="card-dark block transition-colors hover:border-white/15"
              >
                <p className="label-tag green-text text-left">
                  {industry.number}
                </p>
                <h2 className="heading-card mt-4 text-left">
                  {industry.label}
                </h2>
                <p className="body-sm mt-3 text-left">{industry.title}</p>
                <span className="arrow-link mt-6 inline-flex">
                  Read more <span className="arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
