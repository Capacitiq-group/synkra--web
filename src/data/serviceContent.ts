export type PricingTier = {
  name: string;
  setup: string;
  monthly: string;
  description: string;
  allocation?: string;
};

export type ServicePageContent = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  problem: { heading: string; body: string };
  outcome: { heading: string; body: string };
  roiHeading: string;
  pricing: {
    heading: string;
    subtext: string;
    tiers: PricingTier[];
  };
  afterCheckout: { heading: string; body: string; ctaLabel: string };
  bottomCTA: { heading: string; body: string };
  servicePage: string;
  serviceLabel: string;
  brochure: string;
};

// Trimmed to the four confirmed services (was six). Removed: ai-web-widget,
// ai-whatsapp-agent, ai-knowledge-base. See POCKETBASE-MIGRATION-PLAN.md's
// sibling doc, the services cleanup notes, for the full list of files this
// touches (Footer.tsx, pricing.tsx, portfolio.ts, route files).
//
// "Live within two weeks" replaced everywhere below with the corrected
// timeline: from 48 hours after onboarding is complete (not after
// payment), provided the client supplies what's needed on time — longer
// for more complex builds.
//
// Pricing tiers below are unchanged static tiers (setup/monthly/
// description), same shape as before. Replacing these with the
// qualification-form -> auto-quote logic is a real feature build (a form,
// pricing rules, a quote-generation flow) — flagged as its own workstream,
// not attempted as a copy edit here.
export const SERVICE_CONTENT: Record<string, ServicePageContent> = {
  "ai-voice-agent": {
    slug: "ai-voice-agent",
    number: "01",
    serviceLabel: "AI Voice Agent",
    title:
      "The AI receptionist that never misses a call, never has a bad day, and never asks for a salary.",
    subtitle:
      "Every missed call is a potential client who called someone else instead. This agent answers every call your business receives, handles the conversation, and books the appointment without involving you or your team.",
    problem: {
      heading:
        "Your phone is costing you clients every time it rings and no one answers.",
      body: "Callers do not leave voicemails and call back later. They move on. The Voice Agent makes sure your business is always the one that answered.",
    },
    outcome: {
      heading:
        "A business that responds to every caller, at any hour, without adding a single person to your payroll.",
      body: "Your calendar fills without your involvement, your team stops being interrupted by routine calls, and your customers experience a business that is always available and always professional.",
    },
    roiHeading:
      "Find out what your missed calls are actually costing you every month.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes your first phone number, a free monthly call allocation, full hosting, and ongoing maintenance. Calls beyond your allocation are charged at R5 per minute.",
      tiers: [
        {
          name: "Entry",
          setup: "R2,500 setup",
          monthly: "R700 / month",
          description:
            "For small businesses that need a professional always-available first point of contact without the cost of a full-time receptionist.",
          allocation: "R100 in free monthly call credits.",
        },
        {
          name: "Standard",
          setup: "R4,500 setup",
          monthly: "R1,200 / month",
          description:
            "For growing businesses with higher call volumes or multiple types of callers that need to be handled differently.",
          allocation: "R250 in free monthly call credits.",
        },
        {
          name: "Premium",
          setup: "R7,000 setup",
          monthly: "R2,500 / month",
          description:
            "For businesses where the phone is a primary revenue channel and every call needs to be handled with depth, consistency, and accuracy at volume.",
          allocation: "R400 in free monthly call credits.",
        },
      ],
    },
    afterCheckout: {
      heading:
        "You will know exactly what is happening with your build at every step.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours. Once onboarding is complete your agent typically goes live within 48 hours, longer for more complex builds. You test and approve it before it goes live. We check in seven days after launch.",
      ctaLabel: "Start your onboarding",
    },
    bottomCTA: {
      heading: "Your next missed call does not have to cost you a client.",
      body: "Onboarding starts the moment payment clears, and your agent can be live within 48 hours of onboarding being complete.",
    },
    servicePage: "/services/ai-voice-agent",
    brochure: "/brochures/ai-voice-agent.pdf",
  },
  "speed-to-lead": {
    slug: "speed-to-lead",
    number: "02",
    serviceLabel: "Speed to Lead",
    title:
      "The system that calls your new leads within 90 seconds of them submitting a form, before your competitors have seen the notification.",
    subtitle:
      "The first business to contact a new lead wins the deal the majority of the time. This system makes sure that business is always yours.",
    problem: {
      heading:
        "You are spending money generating leads and losing them to businesses that move faster.",
      body: "A lead fills in a form right now and at this moment they are interested. An hour later someone from your team calls them. By then they have already spoken to two competitors.",
    },
    outcome: {
      heading:
        "A lead pipeline where every new prospect is contacted before they have time to consider anyone else.",
      body: "Every form submission triggers an immediate AI call. Leads are qualified and appointments are booked before your team has finished their morning coffee.",
    },
    roiHeading:
      "Find out what slow lead follow-up is costing your business every month.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes the trigger system connected to your lead sources, the AI caller build, full hosting, and ongoing maintenance. Call usage beyond your free allocation is charged at R5 per minute.",
      tiers: [
        {
          name: "Entry",
          setup: "R3,000 setup",
          monthly: "R700 / month",
          description:
            "For businesses generating a moderate volume of leads from one or two sources who need those leads contacted immediately without adding to their team's workload.",
          allocation: "R100 in free monthly call credits.",
        },
        {
          name: "Standard",
          setup: "R5,000 setup",
          monthly: "R1,200 / month",
          description:
            "For businesses with higher lead volumes or multiple lead sources that all need to trigger the same immediate response, with outcomes feeding into a CRM automatically.",
          allocation: "R250 in free monthly call credits.",
        },
        {
          name: "Premium",
          setup: "R7,000 setup",
          monthly: "R2,500 / month",
          description:
            "For businesses where lead generation is a primary growth channel and the system needs to handle high volumes across multiple sources and integrate with a full sales pipeline.",
          allocation: "R400 in free monthly call credits.",
        },
      ],
    },
    afterCheckout: {
      heading:
        "Your system is live and calling new leads automatically once onboarding is done.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours where we connect your lead sources and build the caller. You test every scenario before it goes live. Once onboarding is complete, typically live within 48 hours, longer for more complex builds.",
      ctaLabel: "Start your onboarding",
    },
    bottomCTA: {
      heading:
        "Every lead you generate deserves to be contacted before they change their mind.",
      body: "We close the gap between form submission and first contact permanently, live within 48 hours of onboarding being complete.",
    },
    servicePage: "/services/speed-to-lead",
    brochure: "/brochures/speed-to-lead.pdf",
  },
  "lead-reactivation": {
    slug: "lead-reactivation",
    number: "03",
    serviceLabel: "Lead Reactivation",
    title:
      "The campaign that books meetings from the contacts your business has already written off.",
    subtitle:
      "Every business has a database of people who showed interest and then went quiet. That list is not dead. It is the most valuable asset in your CRM and most businesses are sitting on it doing nothing.",
    problem: {
      heading:
        "Your most qualified prospects are already in your database. You are just not talking to them.",
      body: "Reactivating an existing contact costs a fraction of acquiring a new lead. Most businesses do not do it because running it manually at scale is too time-consuming.",
    },
    outcome: {
      heading:
        "Booked meetings from people you had completely written off, without spending a rand on new lead generation.",
      body: "We go through your database, build personalised outreach for each contact, and run the campaign across calls, SMS, and WhatsApp. Revenue from a list you already own.",
    },
    roiHeading: "Find out what your dormant database is worth if you actually worked it.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes contact list processing, personalised message generation, full campaign build, and execution. Call usage is charged at R5 per minute and SMS at R0.90 per message on top of the plan fee.",
      tiers: [
        {
          name: "Entry",
          setup: "R3,500 setup",
          monthly: "R800 / month",
          description:
            "For businesses with a smaller dormant database who want to run a focused reactivation campaign and see what comes back before committing to a larger effort.",
        },
        {
          name: "Standard",
          setup: "R5,500 setup",
          monthly: "R1,500 / month",
          description:
            "For businesses with a larger database who want to run reactivation across multiple channels simultaneously and feed responses into a sales pipeline.",
        },
        {
          name: "Premium",
          setup: "R8,000 setup",
          monthly: "R3,000 / month",
          description:
            "For businesses with a substantial dormant database where reactivation is a serious revenue recovery exercise that needs to be sophisticated, personalised, and tracked against clear commercial outcomes.",
        },
      ],
    },
    afterCheckout: {
      heading: "Your campaign reaches dormant contacts once onboarding is complete.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours where we review your database and agree on targeting criteria. Nothing goes out until you approve the messaging. Typically live within 48 hours of onboarding being complete, longer for larger databases.",
      ctaLabel: "Start your onboarding",
    },
    bottomCTA: {
      heading:
        "The most valuable leads your business has are already in your database waiting to hear from you.",
      body: "We can have your first reactivation campaign running within 48 hours of onboarding being complete.",
    },
    servicePage: "/services/lead-reactivation",
    brochure: "/brochures/lead-reactivation.pdf",
  },
  "custom-agentic-ai": {
    slug: "custom-agentic-ai",
    number: "04",
    serviceLabel: "Custom Agentic AI",
    title:
      "An AI system built to actually do the work, not just answer questions about it.",
    subtitle:
      "Most AI tools stop at answering a question. This is an agent that takes the next step itself, updating your systems, preparing documents, and coordinating a process end to end, only stopping to bring in a person when the situation genuinely needs one.",
    problem: {
      heading:
        "Your business has processes that follow the same steps every time, and someone still has to do every step by hand.",
      body: "Pulling information from one system into another. Preparing the same kind of document every week. Chasing the next step in a process that never changes. None of it needs judgement, all of it needs a person's time.",
    },
    outcome: {
      heading:
        "A process that runs itself, with a person brought in only for the part that actually needs one.",
      body: "The agent is built around your specific process, working inside the systems you already use, doing the repeatable parts of the work and handing off cleanly when a decision needs a person.",
    },
    roiHeading:
      "Find out what the hours your team spends on repeatable process work are costing you every month.",
    pricing: {
      heading: "Every build is scoped to the process it is automating.",
      subtext:
        "Because the work is different for every business, setup and monthly cost depend on the systems involved, the number of steps in the process, and how much judgement is built into the handoff to a human. Book a discovery call for a scoped quote.",
      tiers: [
        {
          name: "Entry",
          setup: "From R3,000 setup",
          monthly: "From R700 / month",
          description:
            "For a single well-defined process running inside one or two existing systems, with a clear, simple handoff to a person when needed.",
        },
        {
          name: "Standard",
          setup: "From R6,000 setup",
          monthly: "From R1,500 / month",
          description:
            "For a process spanning several systems, with more branching logic and multiple points where the agent needs to make a judgement call about what happens next.",
        },
        {
          name: "Premium",
          setup: "From R10,000 setup",
          monthly: "From R2,500 / month",
          description:
            "For a business running the agent across multiple processes or departments, where reliability and auditability of every action the agent takes matters.",
        },
      ],
    },
    afterCheckout: {
      heading: "Your process is mapped in detail before a single line of it is automated.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours where we map the exact process, the systems it touches, and where a human needs to stay in the loop. Once onboarding is complete, typically live within 48 hours for a single-process build, longer for multi-system builds.",
      ctaLabel: "Start your onboarding",
    },
    bottomCTA: {
      heading:
        "The repeatable work eating your team's time does not need a person doing it by hand.",
      body: "We can have your first process running within 48 hours of onboarding being complete.",
    },
    servicePage: "/services/custom-agentic-ai",
    brochure: "/brochures/custom-agentic-ai.pdf",
  },
};
