import { Link } from "@tanstack/react-router";

export default function ROILink() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main">
        <div className="hairline" />
        <div className="section-padding-sm grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="heading-section max-w-[520px]">
              See what you can build before you talk to anyone.
            </h2>
          </div>
          <div className="max-w-[480px] lg:col-span-5">
            <p className="body-text">
              The fastest way to understand what Synkra actually does is to
              try one of the free tools first. No account, no sales call, no
              commitment.
            </p>
            <Link
              to="/utilities"
              className="arrow-link mt-6 hover:underline"
            >
              Explore free utilities <span className="arrow">→</span>
            </Link>
          </div>
        </div>
        <div className="hairline" />
      </div>
    </section>
  );
}
