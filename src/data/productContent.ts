import type { TierCard } from "@/data/pricingTiers";
import { FLOW_TIERS } from "@/data/pricingTiers";

export type ProductFeature = { title: string; body: string };
export type ProductStep = { title: string; body: string };

export type ProductPageContent = {
  slug: "flow" | "chat";
  number: string;
  productLabel: string;
  status: "live" | "coming-soon";
  title: string;
  subtitle: string;
  problem: { heading: string; body: string };
  outcome: { heading: string; body: string };
  features: ProductFeature[];
  steps: ProductStep[];
  pricing: { heading: string; subtext: string; tiers: TierCard[] } | null;
  cta: { label: string; href: string; external: boolean };
};

export const PRODUCT_CONTENT: Record<"flow" | "chat", ProductPageContent> = {
  flow: {
    slug: "flow",
    number: "01",
    productLabel: "Synkra Flow",
    status: "live",
    title: "Build your own automations, free to start.",
    subtitle:
      "A visual, block-based automation builder you run yourself. No code, no technical knowledge, and no agency fee to get your first workflow live.",
    problem: {
      heading:
        "You are copying data between systems by hand, or paying Zapier or Make more every time your business grows.",
      body: "Repetitive tasks eat hours every week. Most automation tools price by the task, which punishes you the moment your business starts working.",
    },
    outcome: {
      heading:
        "Workflows that run themselves, priced in flat tiers instead of per task.",
      body: "Build from a template or from scratch, connect the tools you already use, and let the workflow run in the background while you work on the business instead of in it.",
    },
    features: [
      { title: "Visual builder", body: "Drag-and-drop blocks for triggers, actions, and branching logic. No code required." },
      { title: "Pre-built templates", body: "Start from a template for common business automations and adjust it to fit." },
      { title: "Webhook and schedule triggers", body: "Connect any form or system, or run workflows on a time interval." },
      { title: "Activity log", body: "See every workflow run with step-by-step results, so nothing happens silently." },
    ],
    steps: [
      { title: "Check out", body: "Pick a plan, starting with Free Forever. No credit card required to start." },
      { title: "Create your account", body: "Create your account and log in to your Flow portal." },
      { title: "Start from a template", body: "Activate one of our pre-built templates or start from scratch with the visual builder." },
      { title: "Connect your tools", body: "Integrate the platforms you already use and publish your first workflow." },
    ],
    pricing: {
      heading: "Free to start, flat pricing as you grow.",
      subtext:
        "Every plan includes hosting and maintenance. Add-ons for AI, SMS, voice, and WhatsApp are pay-as-you-go on Free Forever, and included on paid plans.",
      tiers: FLOW_TIERS,
    },
    cta: {
      label: "Start with Synkra Flow",
      href: "https://client.synkra.co.za/checkout?plan=free",
      external: true,
    },
  },
  chat: {
    slug: "chat",
    number: "02",
    productLabel: "Synkra Chat",
    status: "coming-soon",
    title: "A self-serve AI chat platform, built for how you already talk to customers.",
    subtitle:
      "The same self-serve model as Flow, built around WhatsApp-first business communication. Currently in development.",
    problem: {
      heading:
        "WhatsApp is where your customers already are, but every reply needs a person to send it.",
      body: "Hours go into answering the same questions on WhatsApp every day. A done-for-you AI WhatsApp agent is one option, but not every business wants to hand that over. Some want to build and run it themselves.",
    },
    outcome: {
      heading: "The same self-serve control you get with Flow, applied to how your business talks to customers.",
      body: "Configure how your AI responds, connect it to your customer channels, and manage it yourself, on the same account and billing as Flow.",
    },
    features: [
      { title: "Same account as Flow", body: "One login, one billing relationship, for both products." },
      { title: "WhatsApp-first", body: "Built around how South African businesses actually communicate with customers." },
      { title: "Self-serve setup", body: "Configure your AI's knowledge and responses yourself, no agency build required." },
      { title: "Early access", body: "Waitlist signups are first in line when plans open." },
    ],
    steps: [
      { title: "Check out", body: "Pick a plan once Chat is available. Same account and billing as Flow." },
      { title: "Create your account", body: "Create your account and log in to your Chat portal." },
      { title: "Set up your AI", body: "Configure how your AI responds and what it knows about your business." },
      { title: "Go live", body: "Connect it to your customer channels and you are live." },
    ],
    pricing: null,
    cta: { label: "Join the Chat waitlist", href: "", external: false },
  },
};
