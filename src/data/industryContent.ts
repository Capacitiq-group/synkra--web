export type IndustrySlug =
  | "trades"
  | "medical"
  | "education"
  | "legal-professional-services"
  | "logistics"
  | "hospitality";

export type IndustryPageContent = {
  slug: IndustrySlug;
  number: string;
  /** Short label used in navigation, the footer, and the hub list. */
  label: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  problem: { heading: string; body: string[] };
  configure: { heading: string; body: string };
  connects: { heading: string; body: string };
  cta: { label: string };
};

export const INDUSTRY_ORDER: IndustrySlug[] = [
  "trades",
  "medical",
  "education",
  "legal-professional-services",
  "logistics",
  "hospitality",
];

export const INDUSTRY_CONTENT: Record<IndustrySlug, IndustryPageContent> = {
  trades: {
    slug: "trades",
    number: "01",
    label: "Trades",
    metaTitle: "AI Voice Agents for Trades Businesses, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African trades businesses, electricians, plumbers, HVAC technicians, and contractors, configured to handle calls, quotes, and bookings when nobody is free to answer.",
    title:
      "Built for the business where the person doing the work is also the person answering the phone",
    problem: {
      heading: "The problem",
      body: [
        "It is just after seven on a Tuesday evening. An electrician is halfway up a ladder finishing a job that ran later than planned. His phone rings once and stops. He cannot safely get to it from where he is standing, and by the time he is back down, the caller has already tried the next name on their list.",
        "This happens constantly in trades businesses, because the person best placed to do the job is rarely also free to answer a phone at the same time. South African businesses miss an estimated three in ten sales calls on average, and in a trades business, where most calls are urgent by nature, a missed call is rarely followed by a second attempt from the same customer.",
      ],
    },
    configure: {
      heading: "What we actually configure for a trades business",
      body: "Not a generic answering service. A voice agent configured to your specific trade, your callout process, and how you actually price a job. That can mean triaging an emergency call and telling a customer honestly when someone can get there. It can mean taking down enough detail on a quote request that you can call back with a real number, not a guess. It can mean booking a routine job straight onto your calendar without anyone touching a phone during the job itself.",
    },
    connects: {
      heading: "How this connects",
      body: "The call handling itself runs through Synkra's Agency service, configured specifically to your business. The details it captures can flow straight into Synkra Flow, so a quote request logged during a call becomes a job already sitting in your system, not a note someone has to type up later.",
    },
    cta: { label: "Talk to us about your specific trade" },
  },
  medical: {
    slug: "medical",
    number: "02",
    label: "Medical and Allied Health",
    metaTitle:
      "AI Voice Agents for Clinics and Medical Practices, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African clinics, dental practices, physiotherapists, and optometrists, configured to handle appointment calls when front desk staff cannot.",
    title:
      "Built for the practice where one person is answering the phone, greeting patients, and taking payment at the same time",
    problem: {
      heading: "The problem",
      body: [
        "A patient calls a dental practice on a Wednesday morning to ask about a same day appointment for a cracked tooth. The practice's one receptionist is already on another call and helping someone at the desk who is checking out. The call rings out. The patient does not wait, they look up the next dental practice in the area and call there instead.",
        "This is not a failure of the practice. It is a structural problem, one person cannot be on the phone, at the desk, and free to answer a new call at the same moment, and in a busy practice, that moment happens constantly.",
      ],
    },
    configure: {
      heading: "What we actually configure for a medical practice",
      body: "A voice agent configured to your appointment types, your booking system, and how your practice actually handles urgency. That can mean booking a routine appointment directly, rescheduling one that a patient needs to move, or taking down enough detail on an urgent call that your team can call back the moment someone is free, with the full picture already captured. It can also mean managing a waitlist properly, so a late cancellation gets offered to the next person automatically instead of sitting empty.",
    },
    connects: {
      heading: "How this connects",
      body: "Call handling runs through Synkra's Agency service, configured to your specific practice and booking system. Appointment and enquiry data can flow into Synkra Flow, so nothing needs to be typed into a second system by hand after the call ends.",
    },
    cta: { label: "Talk to us about your practice" },
  },
  education: {
    slug: "education",
    number: "03",
    label: "Education",
    metaTitle:
      "AI Voice Agents for Schools, Tutoring Centres, and Training Providers, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African private schools, tutoring centres, driving schools, and training academies, configured to handle enrolment enquiries during teaching hours.",
    title:
      "Built for the enrolment call that comes in while everyone on staff is teaching",
    problem: {
      heading: "The problem",
      body: [
        "A parent calls a tutoring centre at two in the afternoon to ask about space in the next term. Every tutor on staff is with a student. Nobody is free to answer. The parent moves on to the next name on their list, and the tutoring centre never finds out the call happened at all.",
        "This has nothing to do with the classroom itself. It is an admin problem that happens to sit inside a school, a driving school, or a training academy, and it happens specifically during the hours everyone on staff is doing their actual job.",
      ],
    },
    configure: {
      heading: "What we actually configure for an education business",
      body: "A voice agent configured to your enrolment process, your available spaces, and your fee structure. That can mean answering a parent's questions about space and pricing directly, booking an open day visit, or taking down enough detail on an enquiry that a real staff member can follow up properly once they are free, instead of a message getting lost in the gap between lessons.",
    },
    connects: {
      heading: "How this connects",
      body: "Call and enquiry handling runs through Synkra's Agency service, configured to your specific programme and schedule. Enrolment details can flow into Synkra Flow, so a follow up list builds itself instead of relying on someone remembering to write it down.",
    },
    cta: { label: "Talk to us about your enrolment process" },
  },
  "legal-professional-services": {
    slug: "legal-professional-services",
    number: "04",
    label: "Legal and Professional Services",
    metaTitle:
      "AI Voice Agents for Small Law Firms and Professional Services, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African law firms, accountants, and bookkeeping practices, configured to handle new enquiries during the busiest weeks of the year.",
    title:
      "Built for the week every professional practice dreads answering the phone in",
    problem: {
      heading: "The problem",
      body: [
        "A small accounting firm gets a call in the last week of tax season from someone who wants to become a new client. Every person in the office is either on a call with an existing client or working through a return that is due in two days. The call goes to voicemail, and nobody gets back to it until the following week, by which point the caller has already found someone else to handle it.",
        "The busiest weeks for a professional practice are exactly the weeks a new enquiry is least likely to get answered, which means the moments the practice can least afford to lose a lead are also the moments it is most likely to happen.",
      ],
    },
    configure: {
      heading:
        "What we actually configure for a professional services business",
      body: "A voice agent configured to your services and how you actually take on a new client. That does not mean giving legal or financial advice, and it should not be built to. It means qualifying whether an enquiry is a genuine fit, taking down the details properly, and booking an initial consultation directly onto a calendar, so a new enquiry during your busiest week still gets captured properly instead of disappearing into voicemail.",
    },
    connects: {
      heading: "How this connects",
      body: "Enquiry handling runs through Synkra's Agency service, configured specifically to how your practice actually works. New enquiry details can flow into Synkra Flow, so your team has a clean, ready to review list waiting for them the moment they have capacity again.",
    },
    cta: { label: "Talk to us about your practice" },
  },
  logistics: {
    slug: "logistics",
    number: "05",
    label: "Logistics and Delivery",
    metaTitle:
      "AI Voice Agents for Courier and Delivery Businesses, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African courier, delivery, and small logistics operations, configured to handle customer enquiries during peak dispatch hours.",
    title:
      "Built for the moment your dispatch line is busiest and every enquiry sounds urgent",
    problem: {
      heading: "The problem",
      body: [
        "A courier company's line rings during a delivery rush. Every dispatcher is already on another call coordinating a route. A customer trying to find out where their delivery is gets no answer, tries again twice, then posts about it online instead of getting a straight answer from the business itself.",
        "Delivery and logistics enquiries are almost always time sensitive by nature, which means an unanswered call in this industry turns into a public complaint faster than in most others.",
      ],
    },
    configure: {
      heading: "What we actually configure for a logistics business",
      body: "A voice agent configured to your dispatch system and how your business actually tracks a delivery. That can mean answering a status enquiry directly by checking the same system your dispatchers use, taking a new collection booking without a person needing to step away from coordinating routes, or handling a failed delivery reschedule cleanly, so it does not sit as an unresolved complaint.",
    },
    connects: {
      heading: "How this connects",
      body: "Call handling runs through Synkra's Agency service, configured to your specific dispatch and tracking setup. Booking and reschedule details can flow into Synkra Flow, keeping your operational records accurate without anyone re-entering the same information twice.",
    },
    cta: { label: "Talk to us about your operation" },
  },
  hospitality: {
    slug: "hospitality",
    number: "06",
    label: "Hospitality and Tourism",
    metaTitle:
      "AI Voice Agents for Guesthouses and Tour Operators, Synkra Technologies",
    metaDescription:
      "Synkra Technologies builds AI voice agents for South African guesthouses, small hotels, and tour operators, configured to handle booking enquiries across time zones, at any hour.",
    title:
      "Built for the booking enquiry that comes in while you are standing at the front desk",
    problem: {
      heading: "The problem",
      body: [
        "A guesthouse owner is checking a guest in when the phone rings. It is someone calling from overseas to ask about availability in three weeks, at an hour that is already evening where they are. The owner cannot step away from the desk. The caller, who is already comparing two or three other guesthouses in the same town, moves on to the next one on their list instead.",
        "Hospitality enquiries do not arrive on a predictable local schedule. A guesthouse competing for international guests is competing across every time zone its guests are calling from, at every hour, whether or not anyone is free to answer.",
      ],
    },
    configure: {
      heading: "What we actually configure for a hospitality business",
      body: "A voice agent configured to your rooms, your availability, and your booking process. That can mean answering an availability enquiry directly and taking a provisional booking, handling a WiFi or check in question without pulling you away from a guest already in front of you, or confirming details for an existing booking so a guest does not need to call twice for the same answer.",
    },
    connects: {
      heading: "How this connects",
      body: "Call handling runs through Synkra's Agency service, configured to your specific property and booking system. This is also the industry where Synkra Chat, once it launches, will matter most directly, since so much of hospitality communication already happens over WhatsApp rather than a phone call.",
    },
    cta: { label: "Talk to us about your property" },
  },
};

export const INDUSTRY_LIST = INDUSTRY_ORDER.map((slug) => INDUSTRY_CONTENT[slug]);
