import { Link } from "@tanstack/react-router";

export default function ROILink() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main">
        <div className="hairline" />
        <div className="section-padding-sm grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="heading-section max-w-[520px]">
              Find out what your current manual processes are costing you every
              month.
            </h2>
          </div>
          <div className="max-w-[480px] lg:col-span-5">
            <p className="body-text">
              Most businesses underestimate what they are losing to tasks an AI
              can handle permanently. The calculator shows you the real number
              based on your specific situation.
            </p>
            <Link
              to="/roi-calculator"
              className="arrow-link mt-6 hover:underline"
            >
              Open the ROI Calculator <span className="arrow">→</span>
            </Link>
          </div>
        </div>
        <div className="hairline" />
      </div>
    </section>
  );
}
