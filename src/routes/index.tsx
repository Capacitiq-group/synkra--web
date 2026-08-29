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
      title: "AI Systems That Run Your Business While You Grow It",
      description:
        "Synkra builds AI automation for South African businesses. Done-for-you AI agents through Synkra Agency, or build your own with Synkra Flow and Synkra Chat.",
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
