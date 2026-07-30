import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { buildHead } from "@/lib/seo";
import {
  PORTFOLIO_CATEGORIES,
  portfolioItems,
  type PortfolioItem,
} from "@/data/portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () =>
    buildHead({
      title: "Portfolio — Concept and Client Work",
      description:
        "Browse Synkra's portfolio of AI automation work and client results across every service we build.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [filter, setFilter] = useState("all");

  const visible = useMemo<PortfolioItem[]>(() => {
    if (filter === "all") return portfolioItems;
    return portfolioItems.filter((i) => i.categorySlug === filter);
  }, [filter]);

  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">Portfolio</p>
          <h1 className="heading-section mt-6 max-w-[800px] text-left">
            Work that speaks for itself.
          </h1>
          <p className="body-text mt-8 max-w-[640px] text-left text-lg">
            A collection of concept and client work across our service lineup.
            Every piece here represents the standard we hold ourselves to on
            every project.
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main pt-10">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-left">
            {PORTFOLIO_CATEGORIES.map((c) => {
              const active = filter === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  className={`label-tag pb-1 transition-colors ${
                    active
                      ? "green-text border-b-2 border-[var(--color-brand-green)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="container-main section-padding-sm">
          {visible.length === 0 ? (
            <p className="body-text text-left">
              No projects in this category yet. New work added regularly.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {visible.map((item) => (
                <Link
                  key={item.slug}
                  to="/portfolio/$slug"
                  params={{ slug: item.slug }}
                  className="group block text-left"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0f0f0f]">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="label-tag green-text mt-2">View project →</p>
                    </div>
                  </div>
                  <p className="label-tag green-text mt-5">{item.category}</p>
                  <h2 className="heading-card mt-2">{item.title}</h2>
                  <p className="body-sm mt-2">
                    {item.description.split(".")[0]}.
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
