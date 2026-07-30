import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Products from "@/components/sections/Products";
import WhySynkra from "@/components/sections/WhySynkra";
import HowItWorks from "@/components/sections/HowItWorks";
import DemoSection from "@/components/sections/DemoSection";
import Stats from "@/components/sections/Stats";
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
        "Synkra builds AI automation systems for South African businesses. Voice agents, WhatsApp agents, web widgets, speed-to-lead, lead reactivation, and knowledge bases. From R700 per month.",
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
      <Stats />
      <HowItWorks />
      <Testimonials />
      <ROILink />
      <PricingOverview />
      <PartnerSection />
      <BottomCTA />
    </>
  );
}
