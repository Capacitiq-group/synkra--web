import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { UTILITIES } from "@/data/utilities";

export const Route = createFileRoute("/utilities/")({
  head: () =>
    buildHead({
      title: "Free Business Tools for South African Small Businesses",
      description:
        "Free tools from Synkra Technologies for South African small businesses. A QR code generator, image and file tools, a CSV cleaner, and an email signature generator. No account required.",
      path: "/utilities",
    }),
  component: UtilitiesIndex,
});

function UtilitiesIndex() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tools</p>
        <h1 className="heading-display mt-6 max-w-[900px]">
          Free tools for South African businesses, no account required
        </h1>
        <p className="body-text mt-8 max-w-[640px] text-lg">
          Quick tools you can use right now, free. Nothing is stored longer
          than it takes to process your file.
        </p>
      </div>

      <div className="container-main">
        <div className="hairline" />
      </div>

      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {UTILITIES.map((u) =>
            u.status === "live" ? (
              <Link
                key={u.slug}
                to={`/utilities/${u.slug}` as never}
                className="group flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 transition-colors hover:border-white/15"
              >
                <h2 className="heading-card">{u.name}</h2>
                <p className="body-text mt-3">{u.description}</p>
                <div className="hairline mt-8" />
                <span className="arrow-link mt-5">
                  Use this tool <span className="arrow">→</span>
                </span>
              </Link>
            ) : (
              <div
                key={u.slug}
                className="flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 opacity-60"
              >
                <p className="label-tag text-[var(--color-brand-green)]">Coming soon</p>
                <h2 className="heading-card mt-3">{u.name}</h2>
                <p className="body-text mt-3">{u.description}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
