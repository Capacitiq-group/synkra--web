import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/refund-policy")({
  head: () =>
    buildHead({
      title: "Refund Policy",
      description:
        "Synkra refund and cancellation policy. Everything you need to know about payments, credits, and what happens when you pause or cancel.",
      path: "/legal/refund-policy",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Legal</p>
      <h1 className="heading-section mt-4">Refund Policy</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Refund policy content goes here. */}
      </p>
    </div>
  ),
});
