export type TierCard = {
  name: string;
  price: string;
  cadence: string;
  who: string;
  credits: string;
  featured: boolean;
};

export const AGENCY_TIERS: TierCard[] = [
  {
    name: "Basic",
    price: "From R700",
    cadence: "per month",
    who: "For businesses that need a professional always-available AI system handling one core function.",
    credits: "Includes R100 in free monthly usage credits.",
    featured: false,
  },
  {
    name: "Standard",
    price: "From R1,200",
    cadence: "per month",
    who: "For growing businesses with higher volumes or more complex requirements across one or more services.",
    credits: "Includes R200 to R300 in free monthly usage credits.",
    featured: true,
  },
  {
    name: "Premium",
    price: "From R2,500",
    cadence: "per month",
    who: "For businesses where the automated function is a primary revenue or operations channel.",
    credits: "Includes R300 to R400 in free monthly usage credits.",
    featured: false,
  },
];

// Real, current tiers - pulled from synkra-client-hub's src/lib/plans.ts
// (PLAN_LIMITS). Update here if that file's prices ever change - this is
// now the one place both the homepage and the Flow product page read from.
// Regular prices only - the discounted student price (R149 Basic / R249
// Pro) is shown separately on the Flow product page, not duplicated here.
export const FLOW_TIERS: TierCard[] = [
  {
    name: "Free Forever",
    price: "R0",
    cadence: "per month",
    who: "500 automation runs, 5 active workflows, 1 GB storage. No credit card required.",
    credits: "Pay-as-you-go for AI, SMS, voice, and WhatsApp add-ons.",
    featured: false,
  },
  {
    name: "Basic",
    price: "R199",
    cadence: "per month",
    who: "Higher run limits and included usage credits for growing automation needs.",
    credits: "Includes monthly AI, SMS, voice, and WhatsApp allocation.",
    featured: true,
  },
  {
    name: "Pro",
    price: "R399",
    cadence: "per month",
    who: "The highest run limits, storage, and included usage on Flow.",
    credits: "Includes the largest monthly AI, SMS, voice, and WhatsApp allocation.",
    featured: false,
  },
];
