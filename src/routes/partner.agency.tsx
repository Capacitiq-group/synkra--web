import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/partner/agency")({
  head: () =>
    buildHead({
      title: "Apply as an Agency Partner",
      description:
        "Offer AI automation to your existing clients without building anything yourself. Earn 35% of every setup fee. Apply to become a Synkra agency partner.",
      path: "/partner/agency",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Partner</p>
      <h1 className="heading-section mt-4">Apply as an Agency Partner</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Agency partner application form goes here. */}
      </p>
    </div>
  ),
});
