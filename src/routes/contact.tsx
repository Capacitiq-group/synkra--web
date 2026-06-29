import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ContactForm from "@/components/forms/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({
      title: "Contact Synkra",
      description:
        "Get in touch with the Synkra team. We respond to every enquiry within one business day.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="label-tag">Contact</p>
              <h1 className="heading-display mt-6">Let's build it.</h1>
              <p className="body-text mt-8 max-w-md text-lg">
                Tell us what you are trying to automate. We will reply within
                one business day with the right next step — usually a 30-minute
                discovery call.
              </p>

              <div className="mt-12 space-y-6">
                <div>
                  <p className="label-tag">Email</p>
                  <a
                    href="mailto:Synkra@capacitiqgroup.co.za"
                    className="mt-2 block text-white hover:text-[#56d722] transition-colors"
                  >
                    Synkra@capacitiqgroup.co.za
                  </a>
                </div>
                <div>
                  <p className="label-tag">Response time</p>
                  <p className="mt-2 text-white">Within one business day</p>
                </div>
                <div>
                  <p className="label-tag">Based in</p>
                  <p className="mt-2 text-white">South Africa · Working globally</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#141320] p-8 md:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
