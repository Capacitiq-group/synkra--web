import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/partner/")({
  head: () =>
    buildHead({
      title: "Partner With Synkra",
      description:
        "Agency partners earn 35% and referral partners earn 15% of every setup fee when a client they bring signs up and pays. Apply to become a Synkra partner.",
      path: "/partner",
    }),
  component: PartnerPage,
});

function Divider() {
  return (
    <div className="container-main">
      <div className="hairline" />
    </div>
  );
}

function PartnerPage() {
  return (
    <>
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">Partner with Synkra</p>
          <h1 className="heading-display mt-6 max-w-[800px] text-left">
            Earn by connecting businesses to automation they already need.
          </h1>
          <p className="body-text mt-8 max-w-[600px] text-left text-lg">
            The demand for AI automation is growing faster than most businesses
            know how to act on it. If you are already in conversation with
            business owners, you are already in a position to earn from that.
          </p>
        </div>
      </section>

      <Divider />

      {/* Agency partners */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-left">
              <p className="label-tag green-text">Agency Partners</p>
              <h2 className="heading-section mt-4 max-w-[480px]">
                You already have clients who need this. Offer it under your
                brand without building anything.
              </h2>
              <p className="body-text mt-6 max-w-[440px]">
                If you run a web design agency, a digital marketing agency, an
                IT support company, or any business with a client base that
                could benefit from AI automation, you can offer Synkra services
                as your own. We build and run everything behind the scenes.
                Your clients see your brand. You earn every time one of them
                signs up.
              </p>
            </div>
            <div className="card-dark flex flex-col text-left">
              <p className="label-tag">What you earn</p>
              <p className="display-sm green-text mt-3">35%</p>
              <p className="body-sm mt-4">
                of every setup fee when a client you bring pays. Paid within 7
                days of their payment clearing.
              </p>
              <div className="hairline my-8" />
              <p className="label-tag">Who this is for</p>
              <p className="body-sm mt-3">
                Agencies and service businesses with an existing client base in
                any industry where automation solves a real operational
                problem.
              </p>
              <Link
                to="/partner/agency"
                className="btn-primary mt-8 w-full justify-center"
              >
                Apply as an Agency Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Referral partners */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-left">
              <p className="label-tag green-text">Referral Partners</p>
              <h2 className="heading-section mt-4 max-w-[480px]">
                You know business owners. We do the rest.
              </h2>
              <p className="body-text mt-6 max-w-[440px]">
                You do not need to sell anything or understand how any of it
                works technically. If someone in your network could benefit from
                what Synkra builds, you make the introduction and we take it
                from there. When they sign up and pay, you earn.
              </p>
            </div>
            <div className="card-dark flex flex-col text-left">
              <p className="label-tag">What you earn</p>
              <p className="display-sm green-text mt-3">15%</p>
              <p className="body-sm mt-4">
                of every setup fee when someone you referred pays. Paid within
                7 days of their payment clearing.
              </p>
              <div className="hairline my-8" />
              <p className="label-tag">Who this is for</p>
              <p className="body-sm mt-3">
                Anyone with a network of business owners including consultants,
                coaches, accountants, lawyers, and individuals who move in
                business circles.
              </p>
              <Link
                to="/partner/referral"
                className="btn-primary mt-8 w-full justify-center"
              >
                Apply as a Referral Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* How it works */}
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <p className="label-tag text-left">How it works</p>
          <h2 className="heading-section mt-4 max-w-[560px] text-left">
            From application to your first commission in four steps.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Apply",
                d: "Submit your application on this page. We review every application within 24 hours.",
              },
              {
                n: "02",
                t: "Get approved",
                d: "Once approved you receive your unique referral code, tracking link, and access to your partner portal.",
              },
              {
                n: "03",
                t: "Bring a client",
                d: "Refer or close a client using the materials and support we provide.",
              },
              {
                n: "04",
                t: "Get paid",
                d: "The moment their setup fee clears you receive your commission within 7 days. No chasing, no delays.",
              },
            ].map((s) => (
              <div key={s.n} className="card-dark text-left">
                <p className="display-sm green-text">{s.n}</p>
                <h3 className="heading-card mt-4">{s.t}</h3>
                <p className="body-sm mt-3">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="card-dark mt-12 text-left">
            <p className="label-tag">One rule that protects everyone</p>
            <h3 className="heading-card mt-3">The first payment wins.</h3>
            <p className="body-sm mt-4 max-w-[680px]">
              If two partners refer the same client, the partner whose client
              pays first receives the commission. Registration timestamps your
              claim. The rule is enforced automatically — no disputes, no grey
              areas.
            </p>
          </div>
        </div>
      </section>

      <Divider />

      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding">
          <h2 className="heading-section max-w-[560px] text-left">
            If you know businesses that are losing time and money to manual
            processes, you are already most of the way there.
          </h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/partner/agency" className="btn-primary">
              Apply as an Agency Partner
            </Link>
            <Link to="/partner/referral" className="btn-secondary">
              Apply as a Referral Partner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
