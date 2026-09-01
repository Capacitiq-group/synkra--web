export type HelpQuestion = {
  category: string;
  question: string;
  answer: string;
};

export const helpCategories = [
  "All",
  "Getting Started",
  "Pricing and Credits",
  "Services",
  "Onboarding and Delivery",
  "Account Management",
  "Partners and Affiliates",
] as const;

export const helpCenterQuestions: HelpQuestion[] = [
  {
    category: "Getting Started",
    question: "What is Synkra and what do you actually build?",
    answer:
      "Synkra builds AI automation systems for businesses. This includes voice agents that answer phone calls, WhatsApp agents that handle customer messages, web chat widgets, speed-to-lead systems, lead reactivation campaigns, and AI knowledge bases. Every system is built specifically for your business and hosted on our infrastructure.",
  },
  {
    category: "Getting Started",
    question: "How long does it take to get a service live?",
    answer:
      "Most services go live within two weeks of payment. This includes a 30-minute onboarding call within 24 hours, the build process which typically takes 3 to 10 business days depending on the service and complexity, your review and testing period, and final go-live. Knowledge bases with large document libraries can take up to 14 business days.",
  },
  {
    category: "Getting Started",
    question: "Do I need any technical knowledge to use Synkra services?",
    answer:
      "No. You do not need any technical knowledge. We handle the entire build and setup. You provide information about your business during onboarding and we take care of everything else. Your client portal is designed to be simple enough for anyone to use without technical experience.",
  },
  {
    category: "Pricing and Credits",
    question: "How does the credit system work?",
    answer:
      "Every service runs on a prepaid credit system. Your monthly retainer includes a free credit allocation that resets each billing month. Once that is used you draw from your paid credit balance. When your balance reaches zero your service pauses until you top up. Active calls always finish even if your balance reaches zero mid-call.",
  },
  {
    category: "Pricing and Credits",
    question: "Do unused credits roll over?",
    answer:
      "Free monthly credits do not roll over and reset at the end of each billing month. Paid top-up credits roll over for six months from the date of purchase. After six months any unused paid credits expire automatically.",
  },
  {
    category: "Pricing and Credits",
    question: "Are setup fees refundable?",
    answer:
      "No. Setup fees are non-refundable under any circumstances. Once paid we begin the build process immediately and the fee covers that work regardless of whether you continue with the service afterward.",
  },
  {
    category: "Pricing and Credits",
    question: "What happens when my credit balance runs low?",
    answer:
      "You receive an automatic notification when your balance drops below R50. If your balance reaches zero, new calls or messages will not be processed but any call already in progress will complete naturally. You can top up at any time from your client portal and your service resumes immediately.",
  },
  {
    category: "Services",
    question:
      "Can the AI voice agent sound like it belongs to my specific business?",
    answer:
      "Yes. During your onboarding call we discuss the tone, greeting, persona, and language your business uses so the agent sounds like it was built specifically for you, because it was.",
  },
  {
    category: "Services",
    question: "What happens if the AI cannot answer a customer question?",
    answer:
      "Every agent is trained to recognise when a question falls outside its knowledge. Depending on how you configure it during setup, it will either offer to take a message for a callback or transfer the conversation to a human team member.",
  },
  {
    category: "Services",
    question: "Can I change what my agent says after it goes live?",
    answer:
      "Yes. You can submit a change request at any time through your client portal. Standard and Premium clients receive changes within 24 hours. Basic clients receive changes within 48 hours.",
  },
  {
    category: "Onboarding and Delivery",
    question: "What happens immediately after I pay?",
    answer:
      "Within 60 seconds of your payment clearing you receive a welcome email with your client portal login. Your project is already showing as active inside the portal. Within 24 hours we book your onboarding call.",
  },
  {
    category: "Onboarding and Delivery",
    question: "Do I get to test my service before it goes live?",
    answer:
      "Yes. Before anything goes live to your customers, you receive access to test the system yourself. You can request changes and we action them before final go-live.",
  },
  {
    category: "Onboarding and Delivery",
    question: "What happens seven days after going live?",
    answer:
      "We send a genuine check-in to find out how the first week went and whether anything needs adjusting based on real usage. This is not automated. A real person reaches out.",
  },
  {
    category: "Account Management",
    question: "How do I pause my service?",
    answer:
      "You can schedule a pause directly from your client portal. Before confirming you will be shown exactly what pausing means. Your pause takes effect on your next billing date and you can reverse it at any time before then.",
  },
  {
    category: "Account Management",
    question: "How do I cancel my service?",
    answer:
      "Cancellation works the same way as pausing. You schedule it from your client portal, your service remains active until your next billing date, and you can reverse the cancellation at any point before that date. Once it takes effect your setup fee and remaining credits are forfeited and your data is deleted after 90 days.",
  },
  {
    category: "Account Management",
    question: "Can I come back after cancelling?",
    answer:
      "Yes, but a new setup fee applies since your previous build was deleted after the 90 day retention period. If you return within that 90 day window, contact us directly as a reduced reinstatement fee may be possible.",
  },
  {
    category: "Account Management",
    question: "Can I upgrade my plan?",
    answer:
      "Yes. You can upgrade your monthly plan at any time from your client portal. The new rate applies from your next billing date.",
  },
  {
    category: "Partners and Affiliates",
    question: "How much do partners earn?",
    answer:
      "Agency partners earn 35% of every setup fee when a client they bring pays. Referral partners earn 15%. Commission is paid within 7 days of the client payment clearing.",
  },
  {
    category: "Partners and Affiliates",
    question: "What happens if two partners refer the same client?",
    answer:
      "The partner whose client pays first receives the commission. This is enforced automatically through deal registration timestamps in the partner portal.",
  },
  {
    category: "Partners and Affiliates",
    question: "Do partners earn recurring commission?",
    answer:
      "No. Commission is a once-off payment on the setup fee only. Monthly retainers and usage charges paid by the client afterward belong entirely to Synkra.",
  },
];
