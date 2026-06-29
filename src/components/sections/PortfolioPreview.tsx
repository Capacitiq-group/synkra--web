import { Link } from "@tanstack/react-router";
import { portfolioItems } from "@/data/portfolio";

export default function PortfolioPreview() {
  const items = portfolioItems.slice(0, 3);

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag text-left">Our Work</p>
        <h2 className="heading-section mt-6 max-w-[640px] text-left">
          Concept work that shows exactly what we can build for your brand.
        </h2>
        <p className="body-text mt-6 max-w-[560px] text-left">
          Every portfolio piece below is concept work created to demonstrate the
          quality and creative direction we bring to each service. Real client
          work is added as projects go live.
        </p>

        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
          {items.map((item) => (
            <article
              key={item.slug}
              className="min-w-[85%] shrink-0 snap-start text-left md:min-w-0"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0f0f0f]">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="label-tag green-text mt-5">{item.category}</p>
              <h3 className="heading-card mt-2">{item.title}</h3>
              <p className="body-sm mt-2">{item.description.split(".")[0]}.</p>
              <Link
                to="/portfolio/$slug"
                params={{ slug: item.slug }}
                className="arrow-link mt-4 inline-flex"
              >
                View project <span className="arrow">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-left">
          <Link to="/portfolio" className="btn-secondary">
            View all work
          </Link>
        </div>
      </div>
    </section>
  );
}
