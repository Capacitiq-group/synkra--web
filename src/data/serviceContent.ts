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
  sampleMode?: boolean; // virtual photoshoot uses Request a Sample
};

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
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours. Your agent is built, you test and approve it, and it goes live within two weeks. We check in seven days after launch.",
      ctaLabel: "Get your agent live within two weeks",
    },
    bottomCTA: {
      heading: "Your next missed call does not have to cost you a client.",
      body: "We can have your agent live and answering calls within two weeks from today.",
    },
    servicePage: "/services/ai-voice-agent",
    brochure: "/brochures/ai-voice-agent.pdf",
  },
  "ai-web-widget": {
    slug: "ai-web-widget",
    number: "02",
    serviceLabel: "AI Web Widget",
    title:
      "The agent that turns your website visitors into booked clients instead of lost traffic.",
    subtitle:
      "Most businesses spend money driving people to their website and then lose them because no one was available to answer their questions. This agent has that conversation for you, with every visitor, at any hour.",
    problem: {
      heading:
        "Your website is getting visitors that your business never hears from again.",
      body: "When someone cannot get a fast answer they leave. That is not a traffic problem, it is a response problem, and it is happening on your website right now.",
    },
    outcome: {
      heading:
        "A website that captures leads and books appointments without your involvement.",
      body: "Visitors get answers immediately, qualified leads are captured before they leave, and your website becomes your most consistent team member.",
    },
    roiHeading:
      "Find out how much your unconverted website traffic is worth.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes the widget build, training on your business information, full hosting, and ongoing maintenance. Usage beyond your free allocation is charged at R1.50 per thousand words generated.",
      tiers: [
        {
          name: "Entry",
          setup: "R2,500 setup",
          monthly: "R700 / month",
          description:
            "For businesses that need a reliable first responder on their website that answers questions and captures contact details from visitors who are ready to engage.",
          allocation: "R100 in free monthly usage credits.",
        },
        {
          name: "Standard",
          setup: "R4,000 setup",
          monthly: "R1,200 / month",
          description:
            "For businesses with higher traffic or more complex services that require the agent to handle detailed conversations before a visitor is ready to commit.",
          allocation: "R250 in free monthly usage credits.",
        },
        {
          name: "Premium",
          setup: "R6,000 setup",
          monthly: "R1,800 / month",
          description:
            "For businesses where the website is a primary lead generation channel and the agent needs to handle high volumes, qualify leads, and feed directly into a sales pipeline.",
          allocation: "R400 in free monthly usage credits.",
        },
      ],
    },
    afterCheckout: {
      heading: "Your widget is live and converting visitors within two weeks.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours. You test and approve before anything goes live. We check in seven days after launch with early engagement data.",
      ctaLabel: "Get your widget live within two weeks",
    },
    bottomCTA: {
      heading:
        "Every visitor who leaves your website without making contact is a lead you paid to lose.",
      body: "We can close that gap within two weeks.",
    },
    servicePage: "/services/ai-web-widget",
    brochure: "/brochures/ai-web-widget.pdf",
  },
  "ai-whatsapp-agent": {
    slug: "ai-whatsapp-agent",
    number: "03",
    serviceLabel: "AI WhatsApp Agent",
    title:
      "The agent that responds to every WhatsApp message your business receives, instantly, at any hour.",
    subtitle:
      "South African customers do not want to call or fill in a form. They send a WhatsApp and they expect a fast reply. When that reply is slow or never comes, the conversation is over.",
    problem: {
      heading:
        "Manual WhatsApp management is one of the most expensive hidden costs in a small business.",
      body: "Someone on your team is reading messages, typing the same responses repeatedly, and doing it across multiple conversations while trying to do everything else their job requires.",
    },
    outcome: {
      heading:
        "A business that responds to every WhatsApp message immediately without adding to your team's workload.",
      body: "Every message gets an instant accurate response. Leads are qualified and moved forward. Your team focuses on work that actually requires a human.",
    },
    roiHeading:
      "Find out what manual WhatsApp management is costing your team every month.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes connection to your WhatsApp Business number, training on your business information, full hosting, and ongoing maintenance. Conversations beyond your free allocation are charged at R0.50 per customer-initiated conversation and R1.50 per business-initiated conversation.",
      tiers: [
        {
          name: "Entry",
          setup: "R2,500 setup",
          monthly: "R700 / month",
          description:
            "For businesses that receive a moderate volume of WhatsApp enquiries and need those conversations handled professionally without adding to their team's workload.",
          allocation: "R100 in free monthly conversation credits.",
        },
        {
          name: "Standard",
          setup: "R4,000 setup",
          monthly: "R1,200 / month",
          description:
            "For businesses with higher message volumes or those that need the agent to follow up proactively and feed information into a CRM or sales pipeline.",
          allocation: "R250 in free monthly conversation credits.",
        },
        {
          name: "Premium",
          setup: "R6,000 setup",
          monthly: "R1,800 / month",
          description:
            "For businesses where WhatsApp is a primary customer communication channel and the agent needs to manage high volumes and operate as a full communication system.",
          allocation: "R400 in free monthly conversation credits.",
        },
      ],
    },
    afterCheckout: {
      heading:
        "Your WhatsApp agent is live and responding to customers within two weeks.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours. You test and approve before the agent handles a single real message. We check in seven days after launch.",
      ctaLabel: "Get your agent live within two weeks",
    },
    bottomCTA: {
      heading:
        "Your customers are sending messages right now that your business is too slow to answer.",
      body: "We can solve that permanently within two weeks.",
    },
    servicePage: "/services/ai-whatsapp-agent",
    brochure: "/brochures/ai-whatsapp-agent.pdf",
  },
  "speed-to-lead": {
    slug: "speed-to-lead",
    number: "04",
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
        "Your system is live and calling new leads automatically within two weeks.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours where we connect your lead sources and build the caller. You test every scenario before it goes live.",
      ctaLabel: "Get your system live within two weeks",
    },
    bottomCTA: {
      heading:
        "Every lead you generate deserves to be contacted before they change their mind.",
      body: "We close the gap between form submission and first contact permanently.",
    },
    servicePage: "/services/speed-to-lead",
    brochure: "/brochures/speed-to-lead.pdf",
  },
  "lead-reactivation": {
    slug: "lead-reactivation",
    number: "05",
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
      heading:
        "Your campaign is live and reaching dormant contacts within two weeks.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours where we review your database and agree on targeting criteria. Nothing goes out until you approve the messaging.",
      ctaLabel: "Get your campaign live within two weeks",
    },
    bottomCTA: {
      heading:
        "The most valuable leads your business has are already in your database waiting to hear from you.",
      body: "We can have your first reactivation campaign running within two weeks.",
    },
    servicePage: "/services/lead-reactivation",
    brochure: "/brochures/lead-reactivation.pdf",
  },
  "ai-knowledge-base": {
    slug: "ai-knowledge-base",
    number: "06",
    serviceLabel: "AI Knowledge Base",
    title:
      "The system that knows everything about your business and answers any question your team has in seconds.",
    subtitle:
      "Every hour your staff spend searching for information is an hour they are not doing the work your business pays them for.",
    problem: {
      heading:
        "Your business knowledge is scattered, inaccessible, and walking out the door every time someone resigns.",
      body: "New staff take weeks to get up to speed. Experienced staff get interrupted constantly by colleagues asking questions they should be able to answer themselves.",
    },
    outcome: {
      heading:
        "A team that spends its time doing the work, not looking for the information they need to do it.",
      body: "Every answer is one question away. Onboarding time drops. Senior staff stop getting interrupted. Sensitive information stays in a controlled environment.",
    },
    roiHeading:
      "Find out what your team's time spent searching for information is costing you every month.",
    pricing: {
      heading: "Choose the plan that fits where your business is right now.",
      subtext:
        "Every plan includes document processing, knowledge base build, a staff-facing chat interface, full hosting, and ongoing maintenance. Queries beyond your monthly allocation are charged between R2.00 and R4.00 per thousand queries.",
      tiers: [
        {
          name: "Entry",
          setup: "R3,500 setup",
          monthly: "R800 / month",
          description:
            "For small teams who need reliable access to their internal knowledge without the chaos of shared drives and institutional memory that disappears when people leave.",
          allocation: "500 queries included per month.",
        },
        {
          name: "Standard",
          setup: "R6,000 setup",
          monthly: "R1,800 / month",
          description:
            "For growing businesses with larger document libraries and teams that need fast accurate answers across multiple departments or locations.",
          allocation: "2,000 queries included per month.",
        },
        {
          name: "Premium",
          setup: "R9,000 setup",
          monthly: "R5,000 / month",
          description:
            "For organisations where institutional knowledge is a competitive asset and compliance requirements demand controlled auditable access to sensitive information at scale.",
          allocation: "10,000 queries included per month.",
        },
      ],
    },
    afterCheckout: {
      heading:
        "Your knowledge base is live and answering staff questions within two weeks.",
      body: "Portal access within 60 seconds of payment. Onboarding call within 24 hours. For larger document libraries the build takes up to 14 business days. You review and test before anything goes live to your team.",
      ctaLabel: "Get your knowledge base live within two weeks",
    },
    bottomCTA: {
      heading:
        "The knowledge your business needs to run efficiently already exists. Your team just cannot access it fast enough.",
      body: "We can change that within two weeks.",
    },
    servicePage: "/services/ai-knowledge-base",
    brochure: "/brochures/ai-knowledge-base.pdf",
  },
};

export const SERVICE_PAGE_ORDER = [
  "ai-voice-agent",
  "ai-web-widget",
  "ai-whatsapp-agent",
  "speed-to-lead",
  "lead-reactivation",
  "ai-knowledge-base",
] as const;
