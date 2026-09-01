import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import { PRODUCT_CONTENT } from "@/data/productContent";

export const Route = createFileRoute("/products/")({
  head: () =>
    buildHead({
      title: "Synkra Flow and Synkra Chat, Self-Serve AI Tools",
      description:
        "Synkra Flow and Synkra Chat: self-serve AI automation and communication tools you build and run yourself. Free to start.",
      path: "/products",
    }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const products = [PRODUCT_CONTENT.flow, PRODUCT_CONTENT.chat];
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag">Products</p>
          <h1 className="heading-display mt-6 max-w-[900px]">
            Build it yourself. Self-serve AI tools for South African businesses.
          </h1>
          <p className="body-text mt-8 max-w-[640px] text-lg">
            Prefer to build and run it yourself rather than have us do it
            for you? Flow and Chat are self-serve, and priced to start free.
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a]">
        <div className="container-main">
          <div className="hairline" />
        </div>
        <div className="container-main section-padding">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {products.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}` as never}
                className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0f0f0f] p-8 transition-colors hover:border-white/15"
              >
                <span className="numeral-sm absolute right-6 top-6 text-white/15">{p.number}</span>
                {p.status === "coming-soon" && (
                  <span className="label-tag text-[var(--color-brand-green)]">Coming soon</span>
                )}
                <h2 className="heading-card mt-4 max-w-[80%]">{p.productLabel}</h2>
                <p className="body-text mt-3">{p.subtitle}</p>
                <div className="hairline mt-8" />
                <span className="arrow-link mt-5">
                  Learn more <span className="arrow">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
