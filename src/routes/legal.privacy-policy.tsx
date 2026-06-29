import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/privacy-policy")({
  head: () =>
    buildHead({
      title: "Privacy Policy",
      description:
        "How Synkra collects, uses, and protects your personal information.",
      path: "/legal/privacy-policy",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Legal</p>
      <h1 className="heading-section mt-4">Privacy Policy</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Privacy policy content goes here. */}
      </p>
    </div>
  ),
});
