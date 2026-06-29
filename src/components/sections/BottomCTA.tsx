import { Link } from "@tanstack/react-router";

export default function BottomCTA() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="max-w-[820px]">
          <h2 className="heading-display">
            Your business does not stop at 5pm. Your systems should not either.
          </h2>
          <p className="body-text mt-8 max-w-[600px]">
            Every day without automation is another day of missed calls, slow
            follow-up, and manual processes eating into time and revenue that
            should be going toward growth.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link to="/contact" className="btn-primary justify-center">
              Get Started
            </Link>
            <Link to="/contact" className="btn-secondary justify-center">
              Talk to us first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
