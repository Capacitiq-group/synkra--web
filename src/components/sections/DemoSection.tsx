import { useState } from "react";
import { Link } from "@tanstack/react-router";

const DEMOS = [
  {
    key: "voice",
    label: "AI Voice Agent",
    heading: "Hear what your callers would hear.",
    body: "A caller rings your business at 21:40 on a Saturday. The agent answers on the first ring, understands what they need, checks your calendar, and books them in — all before your competitor has even seen a missed call notification.",
    transcript: [
      { who: "Caller", line: "Hi, are you open tomorrow? I need a quote." },
      { who: "Synkra", line: "We are. I can book you a quote call tomorrow at 09:00 or 14:00 — which suits you?" },
      { who: "Caller", line: "Nine works." },
      { who: "Synkra", line: "Booked. You will get an SMS confirmation in a moment. Anything else I can help with?" },
    ],
  },
  {
    key: "whatsapp",
    label: "AI WhatsApp Agent",
    heading: "Every WhatsApp answered in seconds.",
    body: "Customers message the number they already have saved. The agent replies instantly in your tone, answers pricing and availability questions, and hands over to a human the moment it matters.",
    transcript: [
      { who: "Customer", line: "How much for a service on a 2019 Polo?" },
      { who: "Synkra", line: "A minor service on a 2019 Polo is R1,850 including parts. Would you like the first available slot?" },
      { who: "Customer", line: "Yes please." },
      { who: "Synkra", line: "Thursday 08:00 is open. Confirm and I will hold it for you." },
    ],
  },
  {
    key: "speed",
    label: "Speed to Lead",
    heading: "Every new lead called within 90 seconds.",
    body: "A form submission triggers an immediate outbound call, a WhatsApp message, and a CRM record. The lead speaks to your business while they are still on your website.",
    transcript: [
      { who: "Trigger", line: "Website form submitted — 00:00" },
      { who: "Synkra", line: "Outbound call placed — 00:41" },
      { who: "Synkra", line: "Lead qualified and booked — 03:12" },
      { who: "Synkra", line: "CRM updated and team notified — 03:14" },
    ],
  },
] as const;

export default function DemoSection() {
  const [active, setActive] = useState<string>(DEMOS[0].key);
  const demo = DEMOS.find((d) => d.key === active) ?? DEMOS[0];

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="hairline" />
            <p className="label-tag mt-6">See It Work</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="heading-section max-w-3xl">
              This is what it looks like when the system is doing the work
              instead of your team.
            </h2>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {DEMOS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              className={`cursor-pointer border-b-2 pb-2 text-sm font-medium transition-colors ${
                active === d.key
                  ? "border-[var(--color-brand-green)] text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-[520px]">
            <h3 className="heading-card">{demo.heading}</h3>
            <p className="body-text mt-4">{demo.body}</p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary justify-center">
                Book a live demo
              </Link>
              <Link to="/services" className="btn-secondary justify-center">
                See all systems
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#0f0f0f] p-6 lg:p-8">
            <p className="label-tag text-white/40">Sample interaction</p>
            <div className="mt-6 space-y-5">
              {demo.transcript.map((t, i) => (
                <div key={i}>
                  <p className="label-tag text-[var(--color-brand-green)]">
                    {t.who}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {t.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
