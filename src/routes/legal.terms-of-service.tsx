import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/terms-of-service")({
  head: () =>
    buildHead({
      title: "Terms of Service",
      description:
        "The terms and conditions governing your use of Synkra services.",
      path: "/legal/terms-of-service",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Legal</p>
      <h1 className="heading-section mt-4">Terms of Service</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Terms of service content goes here. */}
      </p>
    </div>
  ),
});
