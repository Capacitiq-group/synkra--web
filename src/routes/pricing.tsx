import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildHead({
      title: "Transparent Pricing",
      description:
        "Every Synkra service has a clear setup fee and monthly retainer. No hidden costs, no long-term contracts. View full pricing for all seven services.",
      path: "/pricing",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Pricing</p>
      <h1 className="heading-section mt-4">Transparent Pricing</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Pricing tiers go here. */}
      </p>
    </div>
  ),
});
