import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ApplicationForm, {
  type FieldDef,
} from "@/components/forms/ApplicationForm";

export const Route = createFileRoute("/partner/referral")({
  head: () =>
    buildHead({
      title: "Apply as a Referral Partner",
      description:
        "Earn 15% of every setup fee by introducing businesses to Synkra. No selling required. Apply to become a Synkra referral partner.",
      path: "/partner/referral",
    }),
  component: ReferralApplicationPage,
});

const FIELDS: FieldDef[] = [
  { name: "full_name", label: "Full name", type: "text", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "phone", label: "Phone number", type: "tel", required: true },
  {
    name: "professional_role",
    label: "What do you currently do professionally",
    type: "textarea",
    rows: 3,
    required: true,
  },
  {
    name: "network_description",
    label: "How would you describe your network",
    type: "textarea",
    rows: 4,
    placeholder: "Who do you know and what industries are they in",
    required: true,
  },
  {
    name: "referral_source",
    label: "How did you hear about the Synkra partner programme",
    type: "select",
    options: [
      "LinkedIn",
      "Google",
      "Referred by someone",
      "Social media",
      "Other",
    ],
    required: true,
  },
];

function ReferralApplicationPage() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <Link to="/partner" className="arrow-link inline-flex">
          <span className="arrow rotate-180">→</span> Back to Partner page
        </Link>

        <p className="label-tag mt-10 text-left">
          Referral Partner Application
        </p>
        <h1 className="heading-section mt-4 max-w-[640px] text-left">
          Earn by introducing businesses to automation they already need.
        </h1>
        <p className="body-text mt-6 max-w-[560px] text-left">
          Referral partners earn 15% of every setup fee when someone they refer
          signs up and pays. You do not sell anything, you do not need to
          understand the technology, and you do not manage the relationship
          after the introduction. You make the connection and we do the rest.
        </p>

        <div className="card-dark mt-8 max-w-[560px] text-left">
          <p className="label-tag green-text">✓ 15% commission on every setup fee</p>
          <p className="label-tag green-text mt-3">✓ Paid within 7 days of client payment</p>
          <p className="label-tag green-text mt-3">
            ✓ No selling or technical knowledge required
          </p>
        </div>

        <div className="hairline my-12" />

        <ApplicationForm
          formType="referral_application"
          fields={FIELDS}
          submitLabel="Submit Application"
          consentLabel={
            <>
              I have read and agree to the{" "}
              <Link
                to="/legal/terms-of-service"
                target="_blank"
                className="green-text underline"
              >
                Synkra Partner Agreement
              </Link>
              .
            </>
          }
          successHeading="Application received."
          successBody={
            <>
              We review every application within 24 hours. If your application
              is approved you will hear from us by email with your partner
              portal access and everything you need to get started. If you have
              questions in the meantime send them to{" "}
              <a
                href="mailto:synkra@capacitiqgroup.co.za"
                className="green-text underline"
              >
                synkra@capacitiqgroup.co.za
              </a>
              .
            </>
          }
          errorBody={
            <>
              Something went wrong. Please try again or email us directly at{" "}
              <a
                href="mailto:synkra@capacitiqgroup.co.za"
                className="green-text underline"
              >
                synkra@capacitiqgroup.co.za
              </a>
              .
            </>
          }
        />
      </div>
    </section>
  );
}
