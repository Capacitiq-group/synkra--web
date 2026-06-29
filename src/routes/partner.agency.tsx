import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ApplicationForm, {
  type FieldDef,
} from "@/components/forms/ApplicationForm";

export const Route = createFileRoute("/partner/agency")({
  head: () =>
    buildHead({
      title: "Apply as an Agency Partner",
      description:
        "Offer AI automation to your existing clients without building anything yourself. Earn 35% of every setup fee. Apply to become a Synkra agency partner.",
      path: "/partner/agency",
    }),
  component: AgencyApplicationPage,
});

const FIELDS: FieldDef[] = [
  { name: "full_name", label: "Full name", type: "text", required: true },
  {
    name: "business_name",
    label: "Business name",
    type: "text",
    required: true,
  },
  { name: "website", label: "Business website", type: "url", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "phone", label: "Phone number", type: "tel", required: true },
  {
    name: "business_type",
    label: "What type of agency or business do you run",
    type: "textarea",
    rows: 3,
    required: true,
  },
  {
    name: "client_count",
    label: "How many active retainer clients do you currently have",
    type: "select",
    options: ["1 to 5", "6 to 10", "11 to 20", "20 to 50", "More than 50"],
    required: true,
  },
  {
    name: "industries",
    label: "What industries are your clients in",
    type: "textarea",
    rows: 3,
    required: true,
  },
  {
    name: "approach",
    label: "How do you plan to offer Synkra services to your clients",
    type: "textarea",
    rows: 4,
    required: true,
  },
];

function AgencyApplicationPage() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <Link to="/partner" className="arrow-link inline-flex">
          <span className="arrow rotate-180">→</span> Back to Partner page
        </Link>

        <p className="label-tag mt-10 text-left">Agency Partner Application</p>
        <h1 className="heading-section mt-4 max-w-[640px] text-left">
          Offer AI automation to your clients without building anything
          yourself.
        </h1>
        <p className="body-text mt-6 max-w-[560px] text-left">
          You already have the relationships. We have the technology. Agency
          partners earn 35% of every setup fee when a client they bring signs
          up and pays. There is no recurring commission, no salary, and no
          technical work required on your end. You bring the client, we build
          and run everything, you get paid within 7 days of their payment
          clearing.
        </p>

        <div className="card-dark mt-8 max-w-[560px] text-left">
          <p className="label-tag green-text">✓ 35% commission on every setup fee</p>
          <p className="label-tag green-text mt-3">✓ Paid within 7 days of client payment</p>
          <p className="label-tag green-text mt-3">✓ No recurring commitment required</p>
        </div>

        <div className="hairline my-12" />

        <ApplicationForm
          formType="agency_application"
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
