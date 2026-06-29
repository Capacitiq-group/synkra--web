import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/partner/referral")({
  head: () =>
    buildHead({
      title: "Apply as a Referral Partner",
      description:
        "Refer businesses to Synkra and earn 15% of every setup fee when they sign up and pay. No selling required. Apply to become a Synkra referral partner.",
      path: "/partner/referral",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Partner</p>
      <h1 className="heading-section mt-4">Apply as a Referral Partner</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Referral partner application form goes here. */}
      </p>
    </div>
  ),
});
