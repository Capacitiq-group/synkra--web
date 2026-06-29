import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { buildHead } from "@/lib/seo";
import ContactForm from "@/components/forms/ContactForm";

const SearchSchema = z.object({
  service: z.string().optional(),
  tier: z.string().optional(),
  type: z.string().optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () =>
    buildHead({
      title: "Contact Synkra",
      description:
        "Get in touch with the Synkra team. We respond to every enquiry within 24 hours on business days.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  const { service, tier } = Route.useSearch();

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag text-left">Get in touch</p>
        <h1 className="heading-section mt-4 max-w-[640px] text-left">
          Let us know what you need and we will get back to you within 24 hours
          on business days.
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="max-w-[560px]">
              <ContactForm
                preselectService={service}
                preselectTier={tier}
              />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="card-dark text-left">
              <div>
                <p className="label-tag">Response time</p>
                <p className="body-sm mt-3">
                  We respond to every enquiry within 24 hours on business days.
                  Urgent matters are typically handled the same day.
                </p>
              </div>
              <div className="hairline my-8" />
              <div>
                <p className="label-tag">What happens next</p>
                <p className="body-sm mt-3">
                  After you submit we review your message and come back with
                  either a direct answer, a quote, or a time to talk depending
                  on what you need.
                </p>
              </div>
              <div className="hairline my-8" />
              <div>
                <p className="label-tag">Already a client</p>
                <p className="body-sm mt-3">
                  If you are an existing client with a support request, log into
                  your client portal and submit a request there for faster
                  handling.
                </p>
                <a
                  href="/help"
                  className="arrow-link mt-4 inline-flex"
                >
                  Go to Client Portal <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
