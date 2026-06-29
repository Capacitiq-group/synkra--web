import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { portfolioItems } from "@/data/portfolio";
import { SERVICE_CONTENT } from "@/data/serviceContent";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }) => {
    const item = portfolioItems.find((i) => i.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    if (!item)
      return buildHead({
        title: "Portfolio Item",
        description: "Synkra portfolio",
        path: "/portfolio",
      });
    return buildHead({
      title: `${item.title} — Portfolio`,
      description: item.description,
      path: `/portfolio/${item.slug}`,
    });
  },
  component: PortfolioItemPage,
  notFoundComponent: () => (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding text-left">
        <p className="label-tag">404</p>
        <h1 className="heading-section mt-6">Portfolio item not found.</h1>
        <Link to="/portfolio" className="btn-secondary mt-8">
          Back to portfolio
        </Link>
      </div>
    </section>
  ),
});

function Gallery({
  images,
  fit,
}: {
  images: string[];
  fit: "cover" | "contain";
}) {
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  const n = images.length;

  const Img = ({ src, idx, h }: { src: string; idx: number; h?: string }) => (
    <div className={`relative w-full bg-[#0a0a0a] ${h ?? "aspect-[16/9]"}`}>
      <img
        src={src}
        alt={`Portfolio image ${idx + 1}`}
        className={`h-full w-full ${fitClass}`}
        loading={idx === 0 ? "eager" : "lazy"}
      />
    </div>
  );

  if (n === 1) {
    return (
      <div className="flex flex-col gap-1">
        <Img src={images[0]} idx={0} h="max-h-[80vh] aspect-auto" />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        {images.map((s, i) => (
          <Img key={i} src={s} idx={i} h="aspect-[3/4]" />
        ))}
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="flex flex-col gap-1">
        <Img src={images[0]} idx={0} h="aspect-[16/9]" />
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
          <Img src={images[1]} idx={1} h="aspect-[3/4]" />
          <Img src={images[2]} idx={2} h="aspect-[3/4]" />
        </div>
      </div>
    );
  }
  if (n === 4) {
    return (
      <div className="flex flex-col gap-1">
        <Img src={images[0]} idx={0} h="aspect-[16/9]" />
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {images.slice(1).map((s, i) => (
            <Img key={i} src={s} idx={i + 1} h="aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }
  // 5+
  return (
    <div className="flex flex-col gap-1">
      <Img src={images[0]} idx={0} h="aspect-[16/9]" />
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <Img src={images[1]} idx={1} h="aspect-[3/4]" />
        <Img src={images[2]} idx={2} h="aspect-[3/4]" />
      </div>
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <Img src={images[3]} idx={3} h="aspect-[3/4]" />
        <Img src={images[4]} idx={4} h="aspect-[3/4]" />
      </div>
    </div>
  );
}

function PortfolioItemPage() {
  const { item } = Route.useLoaderData();
  const service = SERVICE_CONTENT[item.categorySlug];
  const pricingHref = service ? `${service.servicePage}#pricing-tiers` : "/pricing";

  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding-sm">
          <Link to="/portfolio" className="arrow-link inline-flex">
            <span className="arrow rotate-180">→</span> Back to portfolio
          </Link>
          <p className="label-tag green-text mt-10 text-left">
            {item.category}
          </p>
          <h1 className="heading-display mt-6 max-w-[800px] text-left">
            {item.title}
          </h1>
          <p className="body-text mt-8 max-w-[640px] text-left text-lg">
            {item.description}
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <Gallery images={item.images} fit={item.imageFit ?? "cover"} />
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-card text-left">About this project</h2>
          <p className="body-text mt-6 max-w-[720px] text-left">
            {item.fullDescription}
          </p>
          {item.disclaimer && (
            <p className="body-sm mt-6 max-w-[720px] text-left italic text-white/40">
              {item.disclaimer}
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <h2 className="heading-card text-left">
            Interested in this for your brand?
          </h2>
          <p className="body-sm mt-4 max-w-[560px] text-left">
            Get in touch and we will show you what we can create with your
            specific products and brand identity.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              Get Started
            </Link>
            <a href={pricingHref} className="btn-secondary">
              View pricing
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
