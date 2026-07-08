import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhySynkra from "@/components/sections/WhySynkra";
import HowItWorks from "@/components/sections/HowItWorks";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import ROILink from "@/components/sections/ROILink";
import PricingOverview from "@/components/sections/PricingOverview";
import PartnerSection from "@/components/sections/PartnerSection";
import BottomCTA from "@/components/sections/BottomCTA";
import Testimonials from "@/components/sections/Testimonials";

export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "AI Systems That Run Your Business While You Grow It",
      description:
        "Synkra builds AI automation systems for South African businesses. Voice agents, WhatsApp agents, speed-to-lead, lead reactivation, knowledge bases, and automated hiring. From R700 per month.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <ServicesGrid />
      <WhySynkra />
      <HowItWorks />
      <PortfolioPreview />
      <Testimonials />
      <ROILink />
      <PricingOverview />
      <PartnerSection />
      <BottomCTA />
    </>
  );
}
