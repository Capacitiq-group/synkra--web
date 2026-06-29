import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/roi-calculator")({
  head: () =>
    buildHead({
      title: "ROI Calculator",
      description:
        "Find out what your current manual processes are costing your business every month and what solving them permanently with AI is worth.",
      path: "/roi-calculator",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">ROI Calculator</p>
      <h1 className="heading-section mt-4">ROI Calculator</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Calculator UI goes here. */}
      </p>
    </div>
  ),
});
