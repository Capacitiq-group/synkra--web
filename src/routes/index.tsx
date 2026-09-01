import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Products from "@/components/sections/Products";
import WhySynkra from "@/components/sections/WhySynkra";
import HowItWorks from "@/components/sections/HowItWorks";
import DemoSection from "@/components/sections/DemoSection";
import ROILink from "@/components/sections/ROILink";
import PricingOverview from "@/components/sections/PricingOverview";
import PartnerSection from "@/components/sections/PartnerSection";
import BottomCTA from "@/components/sections/BottomCTA";
import Testimonials from "@/components/sections/Testimonials";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "Synkra Technologies, AI Automation for South African Businesses",
      description:
        "Synkra Technologies is a South African company building AI voice agents, workflow automation, and custom AI systems for small businesses. Build it yourself for free with Synkra Flow, or have Synkra's team build and run it for you.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Products />
      <DemoSection />
      <WhySynkra />
      <HowItWorks />
      <Testimonials />
      <ROILink />
      <PricingOverview />
      <PartnerSection />
      <BottomCTA />
    </>
  );
}
