import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/partner/")({
  head: () =>
    buildHead({
      title: "Partner With Synkra",
      description:
        "Agency partners earn 35% and referral partners earn 15% of every setup fee when a client they bring signs up and pays. Apply to become a Synkra partner.",
      path: "/partner",
    }),
  component: () => (
    <div className="container-main section-padding">
      <p className="label-tag">Partner</p>
      <h1 className="heading-section mt-4">Partner With Synkra</h1>
      <p className="body-text mt-6 max-w-2xl">
        {/* Partner program overview goes here. */}
      </p>
    </div>
  ),
});
