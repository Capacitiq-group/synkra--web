import type { ServiceData } from "@/components/sections/ServiceDetail";

export const SERVICES: Record<string, ServiceData & { slug: string; short: string }> = {
  "ai-voice-agent": {
    slug: "ai-voice-agent",
    short:
      "An AI receptionist that answers every call, handles the conversation, and books appointments 24/7.",
    eyebrow: "Service · AI Voice Agent",
    title: "An AI receptionist that answers every call your business gets.",
    intro:
      "It picks up on the first ring at any hour, holds a natural conversation in your brand voice, qualifies the caller, and books straight into your calendar.",
    problem: {
      heading:
        "Missed calls are missed revenue. Voicemail is where leads go to disappear.",
      body: "Most South African businesses lose between 20% and 40% of inbound calls because nobody is available to pick up. Those callers do not leave messages, they call the next business on Google.",
    },
    features: [
      { title: "Always on", body: "Answers every call instantly, day, night, weekends, holidays." },
      { title: "Books appointments", body: "Writes directly to your calendar of choice with full caller details." },
      { title: "Sounds human", body: "Natural conversation in your brand voice and local accent options." },
      { title: "Smart routing", body: "Transfers urgent calls to a human and logs everything else." },
    ],
    steps: [
      { title: "Discovery", body: "We map your call types, FAQs, and booking rules." },
      { title: "Build", body: "We configure the voice, the script, and the calendar integration." },
      { title: "Test", body: "We run live test calls with you until it sounds exactly right." },
      { title: "Launch", body: "We point your number, monitor performance, and tune as you go." },
    ],
    outcomes: [
      "Zero missed calls during and outside business hours.",
      "More booked appointments without hiring another front-desk staff member.",
      "Every caller logged with a transcript, number, and intent.",
    ],
    pricing: { from: "R1,500 / mo", note: "Includes setup, calls, and ongoing tuning. Volume-based plans available." },
  },
  "ai-web-widget": {
    slug: "ai-web-widget",
    short:
      "A conversational AI on your website that converts visitors into booked clients before they leave.",
    eyebrow: "Service · AI Web Widget",
    title: "A conversational AI on your site that turns visitors into bookings.",
    intro:
      "Embedded in one line of code. Answers visitor questions instantly, qualifies them, and books them directly into your calendar before they bounce.",
    problem: {
      heading: "Most website traffic leaves without ever speaking to you.",
      body: "Contact forms are slow, intimidating, and abandoned. Live chat needs staff. Your site is open 24/7 but your team is not.",
    },
    features: [
      { title: "Trained on your business", body: "Knows your services, pricing, and policies the moment it goes live." },
      { title: "Captures every lead", body: "Pushes name, email, phone, and conversation to your CRM in real time." },
      { title: "Books in-chat", body: "Visitors choose a slot without ever leaving the conversation." },
      { title: "Brand styled", body: "Colours, copy, avatar, and tone matched to your website." },
    ],
    steps: [
      { title: "Train", body: "We ingest your site, FAQs, and service docs into the agent." },
      { title: "Connect", body: "Calendar and CRM are wired into the widget." },
      { title: "Embed", body: "Drop the script tag on your site or we add it for you." },
      { title: "Optimise", body: "We review conversations weekly for the first month and improve responses." },
    ],
    outcomes: [
      "Higher conversion from existing website traffic.",
      "Qualified bookings landing while your team sleeps.",
      "A searchable record of every visitor question your site is failing to answer.",
    ],
    pricing: { from: "R700 / mo", note: "Includes embed, hosting, conversation training, and monthly review." },
  },
  "ai-whatsapp-agent": {
    slug: "ai-whatsapp-agent",
    short:
      "An AI agent that responds to every WhatsApp message instantly, at any hour, without your team typing.",
    eyebrow: "Service · AI WhatsApp Agent",
    title: "Every WhatsApp message answered instantly, at any hour.",
    intro:
      "Built on the WhatsApp Business API. Replies in seconds, handles full conversations, qualifies leads, and books them in. Your team only sees the ones that need a human.",
    problem: {
      heading: "WhatsApp is where your customers live. Slow replies cost the sale.",
      body: "South African customers expect a reply within minutes on WhatsApp. Reality is most businesses reply hours later, after hours not at all, and lose the conversation to the next provider.",
    },
    features: [
      { title: "Instant replies", body: "Sub-30-second response time on every message, 24/7." },
      { title: "Handles full convos", body: "Quoting, FAQs, follow-ups, and booking — end to end." },
      { title: "Human handoff", body: "Escalates to your team with full context when needed." },
      { title: "Broadcast safe", body: "Stays inside WhatsApp's Business API policy so your number is never at risk." },
    ],
    steps: [
      { title: "Number setup", body: "We provision or migrate your number onto the WhatsApp Business API." },
      { title: "Train", body: "We load your FAQs, pricing, and booking logic." },
      { title: "Pilot", body: "Runs in shadow mode while your team approves replies." },
      { title: "Go live", body: "Fully autonomous with a daily report on conversations and bookings." },
    ],
    outcomes: [
      "Every WhatsApp lead replied to before they message a competitor.",
      "Your team freed from repetitive WhatsApp typing.",
      "More closed deals from a channel that was already driving enquiries.",
    ],
    pricing: { from: "R1,200 / mo", note: "Includes API hosting, agent training, and conversation review." },
  },
  "speed-to-lead": {
    slug: "speed-to-lead",
    short:
      "Calls every new lead within 90 seconds of submitting a form, before competitors see the notification.",
    eyebrow: "Service · Speed to Lead",
    title: "Every new lead called within 90 seconds.",
    intro:
      "The moment a form is submitted, our system fires off an AI voice call, books a meeting if the lead picks up, and texts them if they do not. Your team gets a hot prospect, not a cold callback.",
    problem: {
      heading: "Leads go cold in five minutes. Most teams take five hours.",
      body: "Research shows the odds of qualifying a lead drop 80% after the first five minutes. Email follow-up alone loses you the deal to the competitor who phoned first.",
    },
    features: [
      { title: "90-second call", body: "Automatic AI call to every new web lead the moment they submit." },
      { title: "SMS fallback", body: "If they do not answer, a personalised SMS follows within two minutes." },
      { title: "Calendar booking", body: "Books directly into your sales reps' calendars during the call." },
      { title: "Multi-channel", body: "Plugs into Meta forms, your website, landing pages, and CRMs." },
    ],
    steps: [
      { title: "Connect sources", body: "We wire up every form and ad source feeding you leads." },
      { title: "Build the script", body: "We write the opening, qualifying questions, and booking flow." },
      { title: "Test", body: "We submit test leads and refine until the call lands clean." },
      { title: "Launch & monitor", body: "Live dashboard of call outcomes, bookings, and conversion." },
    ],
    outcomes: [
      "First-call contact rate that beats every competitor in your category.",
      "Booked sales meetings landing while leads are still on your website.",
      "Sales team only speaks to qualified, booked prospects.",
    ],
    pricing: { from: "R2,000 / mo", note: "Includes voice minutes, SMS credits, and ongoing script optimisation." },
  },
  "lead-reactivation": {
    slug: "lead-reactivation",
    short:
      "An AI outreach campaign that books meetings from the dormant contacts already in your database.",
    eyebrow: "Service · Lead Reactivation",
    title: "Book meetings from the leads you already paid to acquire.",
    intro:
      "We run a structured AI outreach campaign across email, SMS, and WhatsApp on your old database. Most businesses see meetings on their calendar inside the first week.",
    problem: {
      heading: "The most profitable leads are the ones already in your CRM.",
      body: "Every business has hundreds or thousands of old enquiries that were never properly followed up. Acquiring a new lead costs many times more than re-engaging an old one.",
    },
    features: [
      { title: "Database audit", body: "We segment your historical leads by recency, source, and intent." },
      { title: "Multi-channel sequence", body: "Email, SMS, and WhatsApp touches over 7 to 14 days." },
      { title: "AI replies", body: "Responses handled by the AI until the prospect agrees to a meeting." },
      { title: "Calendar booking", body: "Booked meetings land directly in your sales team's calendar." },
    ],
    steps: [
      { title: "Export & clean", body: "We pull your dormant contacts and verify deliverability." },
      { title: "Write the campaign", body: "We craft the sequence in your tone with a clear offer." },
      { title: "Launch", body: "Sequence runs over two weeks with full reply handling." },
      { title: "Report", body: "Final report of opens, replies, meetings booked, and revenue closed." },
    ],
    outcomes: [
      "Booked meetings from contacts you had written off.",
      "A reactivated database ready for ongoing nurture.",
      "Clear ROI you can attribute back to a single campaign.",
    ],
    pricing: { from: "R8,500 once-off", note: "Fixed-fee campaign. Add a retainer for quarterly re-runs." },
  },
  "ai-knowledge-base": {
    slug: "ai-knowledge-base",
    short:
      "A private AI trained on your business documents that answers any internal question in seconds.",
    eyebrow: "Service · AI Knowledge Base",
    title: "Every question your team has, answered in seconds.",
    intro:
      "A private AI assistant trained on your SOPs, contracts, product docs, and pricing. Your team stops interrupting senior staff and stops repeating themselves to new hires.",
    problem: {
      heading:
        "Your knowledge is locked in PDFs, inboxes, and the heads of a few key people.",
      body: "New hires take months to get productive. Senior staff spend their day answering questions they have already answered a hundred times. Information that should be one search away is buried in folders nobody can find.",
    },
    features: [
      { title: "Trained on your docs", body: "Ingests PDFs, Word, Sheets, Notion, Confluence, and shared drives." },
      { title: "Source-cited answers", body: "Every reply links back to the exact document and section." },
      { title: "Permission aware", body: "Respects who is allowed to see what." },
      { title: "Slack & Teams ready", body: "Works inside the tools your team already lives in." },
    ],
    steps: [
      { title: "Audit", body: "We map your source documents and access rules." },
      { title: "Ingest", body: "We index every document into a private, secure vector store." },
      { title: "Deploy", body: "Web app, Slack bot, or Teams bot — your choice." },
      { title: "Iterate", body: "We watch unanswered queries and improve coverage monthly." },
    ],
    outcomes: [
      "New hires productive in days, not months.",
      "Senior staff focused on building, not answering FAQs.",
      "A single source of truth that scales as your team grows.",
    ],
    pricing: { from: "R3,500 / mo", note: "Includes hosting, document ingestion, and monthly improvements." },
  },
  "automated-hiring": {
    slug: "automated-hiring",
    short:
      "An AI system that screens applications, contacts qualified candidates, and builds your shortlist.",
    eyebrow: "Service · Automated Hiring",
    title: "Your shortlist, built without reading a single CV.",
    intro:
      "We deploy an AI screening pipeline that reviews every applicant, interviews them by chat or voice, scores against your criteria, and delivers a ranked shortlist straight to the hiring manager.",
    problem: {
      heading:
        "Hiring eats weeks of senior time and the best candidates get hired by someone else first.",
      body: "Job posts on PNet and LinkedIn generate hundreds of applications. Manual sorting takes days. Top candidates accept offers elsewhere before your team has even opened their CV.",
    },
    features: [
      { title: "Auto screening", body: "Every CV scored against your role criteria within minutes of applying." },
      { title: "AI interviews", body: "Conversational screening interview by WhatsApp or voice." },
      { title: "Ranked shortlist", body: "A clean, scored shortlist delivered to the hiring manager." },
      { title: "Candidate experience", body: "Every applicant gets a response — no more ghosting." },
    ],
    steps: [
      { title: "Role intake", body: "We capture the role, must-haves, and culture fit." },
      { title: "Pipeline build", body: "We wire up your job boards and ATS to the screening pipeline." },
      { title: "Live", body: "Applicants screened, interviewed, and scored automatically." },
      { title: "Handover", body: "Final shortlist delivered with notes, transcripts, and recommendations." },
    ],
    outcomes: [
      "Time-to-shortlist measured in days, not weeks.",
      "Hiring managers only meet candidates worth meeting.",
      "Better candidate experience — every applicant hears back.",
    ],
    pricing: { from: "R4,500 per role", note: "Per-role pricing. Retainer available for high-volume hiring." },
  },
};

export const SERVICE_ORDER = [
  "ai-voice-agent",
  "ai-web-widget",
  "ai-whatsapp-agent",
  "speed-to-lead",
  "lead-reactivation",
  "ai-knowledge-base",
  "automated-hiring",
] as const;
