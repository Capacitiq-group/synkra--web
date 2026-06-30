import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import LegalPage from "@/components/layout/LegalPage";

export const Route = createFileRoute("/legal/refund-policy")({
  head: () =>
    buildHead({
      title: "Refund Policy",
      description:
        "Synkra refund and cancellation policy. Everything you need to know about payments, credits, and what happens when you pause or cancel.",
      path: "/legal/refund-policy",
    }),
  component: () => (
    <LegalPage
      title="Refund Policy"
      lastUpdated="30 June 2026"
      sections={[
        {
          heading: "Setup Fees",
          body: "All setup fees are non-refundable. Once paid, work begins immediately on building your service and the fee covers that work regardless of whether you continue afterward.",
        },
        {
          heading: "Monthly Retainers",
          body: "Monthly retainers are non-refundable. They cover hosting, maintenance, and your free credit allocation for that billing period.",
        },
        {
          heading: "Credits",
          body: "All credits, whether free monthly allocations or paid top-ups, are non-refundable. Free credits expire at the end of each billing month if unused. Paid credits roll over for six months from the date of purchase and expire automatically after that period.",
        },
        {
          heading: "Pausing Your Service",
          body: "You can pause your service at any time from your client portal. Pausing does not entitle you to any refund. Your monthly retainer continues during a pause as your service remains hosted and maintained.",
        },
        {
          heading: "Cancelling Your Service",
          body: "You can cancel your service at any time from your client portal. Cancellation takes effect on your next billing date and does not entitle you to a refund of any amount already paid, including setup fees, retainers, or remaining credit balances.",
        },
        {
          heading: "Reinstating After Cancellation",
          body: "If you wish to return after cancelling, a new setup fee applies as your previous build is deleted after our 90 day data retention period.",
        },
        {
          heading: "Disputes",
          body: "If you believe you have been incorrectly charged, contact us at synkra@capacitiqgroup.co.za within 14 days of the charge and we will investigate and respond within 5 business days.",
        },
      ]}
    />
  ),
});
