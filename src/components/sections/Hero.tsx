import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end bg-[#0a0a0a] px-6 pt-32 pb-16 lg:px-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="label-tag fade-in">
          AI Automation for South African Businesses
        </p>
        <h1 className="heading-display fade-in mt-8 max-w-[1100px]">
          AI systems that run your business while you grow it.
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-end">
          <p className="body-text fade-in-delay max-w-[480px] text-base">
            Most businesses are losing time and money to manual processes that
            should not require a human. We build the AI systems that handle
            those processes for you, permanently and at a fraction of what
            hiring someone would cost.
          </p>
          <div className="fade-in-delay flex flex-col items-stretch gap-3 sm:flex-row lg:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#56d722] px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              See what we build
            </Link>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between">
          <div className="hairline flex-1" />
          <span className="label-tag ml-6">Scroll</span>
        </div>
      </div>
    </section>
  );
}
