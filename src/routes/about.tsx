import { createFileRoute } from "@tanstack/react-router";
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

function AboutPage() {
  return (
    <div className="container-main section-padding">
      <p className="label-tag">About</p>
      <h1 className="heading-section mt-4">About Synkra</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* About story, team, and mission go here. */}
      </p>
    </div>
  );
}
