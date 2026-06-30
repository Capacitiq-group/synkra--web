import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import LegalPage from "@/components/layout/LegalPage";

export const Route = createFileRoute("/legal/privacy-policy")({
  head: () =>
    buildHead({
      title: "Privacy Policy",
      description:
        "How Synkra collects, uses, and protects your personal information.",
      path: "/legal/privacy-policy",
    }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="30 June 2026"
      sections={[
        {
          heading: "Information We Collect",
          body: "We collect information you provide directly when you fill in a form, apply as a partner, or sign up for a service. This includes your name, business name, email address, phone number, and any information you share about your business during onboarding. We also collect usage data generated through your service, including call logs, conversation histories, and credit usage.",
        },
        {
          heading: "How We Use Your Information",
          body: "We use your information to deliver and maintain your service, respond to your enquiries, process payments, calculate partner commissions, and send you service-related communications including invoices, usage notifications, and support responses. We do not use your information for purposes beyond what is necessary to operate your service.",
        },
        {
          heading: "How We Store Your Information",
          body: "All client data is stored securely on our own private infrastructure. We do not use third party data processors beyond the essential service providers required to deliver your system, including Twilio for calls and messaging, ElevenLabs for voice processing, and Anthropic for AI processing. These providers process data only as required to deliver the service and do not retain it beyond what is necessary for that purpose.",
        },
        {
          heading: "Data Sharing",
          body: "We do not sell, rent, or share your personal information with any third party for marketing purposes. Your data is only shared with the service providers necessary to deliver your Synkra system, as listed above.",
        },
        {
          heading: "Data Retention",
          body: "If you cancel your service, your data is retained for 90 days and then permanently deleted. If you do not become a client after submitting a contact or application form, your information is retained for 12 months and then deleted unless you request earlier deletion.",
        },
        {
          heading: "Your Rights",
          body: "You have the right to request a copy of the personal information we hold about you, request correction of inaccurate information, and request deletion of your information subject to our legal and operational obligations. To exercise any of these rights, contact us at legal@capacitiqgroup.co.za.",
        },
        {
          heading: "Cookies",
          body: "Our website uses minimal cookies necessary for the site to function correctly. We do not use third party tracking or advertising cookies.",
        },
        {
          heading: "Changes to This Policy",
          body: "We may update this policy from time to time. Material changes will be communicated to active clients via email and noted on this page with an updated revision date.",
        },
        {
          heading: "Contact",
          body: "Questions about this policy can be directed to legal@capacitiqgroup.co.za.",
        },
      ]}
    />
  ),
});
