import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/help")({
  head: () =>
    buildHead({
      title: "Help Center",
      description:
        "Answers to every common question about Synkra services, pricing, credits, onboarding, and how everything works.",
      path: "/help",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Help Center</p>
      <h1 className="heading-section mt-4">Help Center</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Help accordion goes here. */}
      </p>
    </div>
  ),
});
