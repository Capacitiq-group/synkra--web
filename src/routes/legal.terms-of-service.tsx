import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import LegalPage from "@/components/layout/LegalPage";

export const Route = createFileRoute("/legal/terms-of-service")({
  head: () =>
    buildHead({
      title: "Terms of Service",
      description:
        "The terms and conditions governing your use of Synkra services.",
      path: "/legal/terms-of-service",
    }),
  component: () => (
    <LegalPage
      title="Terms of Service"
      lastUpdated="30 June 2026"
      sections={[
        {
          heading: "Agreement to Terms",
          body: "By accessing or using any Synkra service you agree to be bound by these terms. If you do not agree, do not use the service. These terms form a binding agreement between you and Synkra, a product of Capacitiq Group.",
        },
        {
          heading: "Services",
          body: "Synkra builds and operates AI automation systems for businesses including voice agents, WhatsApp agents, web widgets, speed-to-lead, lead reactivation, and knowledge bases. The specific scope of your service is defined during onboarding and recorded in your client portal.",
        },
        {
          heading: "Payments and Credits",
          body: "Setup fees, monthly retainers, and credit top-ups are payable in advance and non-refundable. Pricing and credit usage rates are published on our pricing page and may change with 30 days notice to active clients. Service usage that exceeds your free monthly credit allocation draws from your paid credit balance and pauses when the balance reaches zero.",
        },
        {
          heading: "Acceptable Use",
          body: "You agree not to use Synkra services to send unsolicited communications, harass any person, violate any law, infringe intellectual property, or attempt to access or interfere with any system you are not authorised to use. We may suspend or terminate any service we reasonably believe is being misused.",
        },
        {
          heading: "Client Responsibilities",
          body: "You are responsible for the accuracy of information you provide during onboarding, for keeping your client portal credentials secure, for compliance with any laws applicable to your business, and for obtaining any consents required from your own customers before their data is processed through a Synkra system.",
        },
        {
          heading: "Intellectual Property",
          body: "Synkra retains ownership of all software, infrastructure, and underlying systems used to deliver your service. You retain ownership of your content, brand assets, and customer data. You grant Synkra a limited licence to use that material solely to operate your service.",
        },
        {
          heading: "Confidentiality",
          body: "Each party agrees to keep confidential any non-public information disclosed by the other during the course of the engagement and to use it only for the purpose of delivering or receiving the service.",
        },
        {
          heading: "Liability",
          body: "To the maximum extent permitted by law, Synkra's total liability arising out of or related to the service is limited to the amount you paid to Synkra in the three months immediately preceding the event giving rise to the claim. Synkra is not liable for indirect, incidental, special, or consequential damages.",
        },
        {
          heading: "Termination",
          body: "Either party may terminate the service at any time as described in our refund policy. On termination your data is retained for 90 days and then permanently deleted.",
        },
        {
          heading: "Governing Law",
          body: "These terms are governed by the laws of the Republic of South Africa. Any dispute arising under these terms is subject to the exclusive jurisdiction of the South African courts.",
        },
        {
          heading: "Changes to These Terms",
          body: "We may update these terms from time to time. Material changes will be communicated to active clients via email and noted on this page with an updated revision date.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms can be directed to legal@capacitiqgroup.co.za.",
        },
      ]}
    />
  ),
});
