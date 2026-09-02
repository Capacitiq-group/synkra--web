import { createFileRoute, notFound } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import IndustryPageLayout from "@/components/layout/IndustryPageLayout";
import {
  INDUSTRY_CONTENT,
  type IndustrySlug,
} from "@/data/industryContent";

function getIndustry(slug: string) {
  return INDUSTRY_CONTENT[slug as IndustrySlug] ?? null;
}

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = getIndustry(params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Industry not found, Synkra Technologies" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { industry } = loaderData;
    return buildHead({
      title: industry.metaTitle,
      description: industry.metaDescription,
      path: `/industries/${industry.slug}`,
    });
  },
  notFoundComponent: IndustryNotFound,
  component: IndustryPage,
});

function IndustryPage() {
  const { industry } = Route.useLoaderData();
  return <IndustryPageLayout data={industry} />;
}

function IndustryNotFound() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Industries</p>
        <h1 className="heading-section mt-4 text-left">
          We could not find that industry page.
        </h1>
      </div>
    </section>
  );
}
