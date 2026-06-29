import { Link } from "@tanstack/react-router";

export default function PartnerSection() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">Partner With Synkra</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section max-w-[580px]">
              Already working with businesses that need this? Earn every time
              one of them signs up.
            </h2>
            <p className="body-text mt-8 max-w-[560px]">
              Agency partners earn 35% of every setup fee. Referral partners
              earn 15%. No recurring commission, no salary, and no technical
              work required. You bring the relationship, we do the rest.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/partner/agency" className="btn-primary justify-center">
                Become an Agency Partner
              </Link>
              <Link
                to="/partner/referral"
                className="btn-secondary justify-center"
              >
                Become a Referral Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
