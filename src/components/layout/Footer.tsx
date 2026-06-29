import { Link } from "@tanstack/react-router";

const SERVICES = [
  { to: "/services/ai-voice-agent", label: "AI Voice Agent" },
  { to: "/services/ai-web-widget", label: "AI Web Widget" },
  { to: "/services/ai-whatsapp-agent", label: "AI WhatsApp Agent" },
  { to: "/services/speed-to-lead", label: "Speed to Lead" },
  { to: "/services/lead-reactivation", label: "Lead Reactivation" },
  { to: "/services/ai-knowledge-base", label: "AI Knowledge Base" },
  { to: "/services/automated-hiring", label: "Automated Hiring" },
];

const COMPANY = [
  { to: "/about", label: "About" },
  { to: "/partner", label: "Partner With Us" },
  { to: "/contact", label: "Client Login" },
  { to: "/partner", label: "Partner Login" },
  { to: "/legal/privacy-policy", label: "Privacy Policy" },
  { to: "/legal/terms-of-service", label: "Terms of Service" },
  { to: "/legal/refund-policy", label: "Refund Policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 pt-12 lg:px-8">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#252430] p-8 lg:p-14">
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <p className="text-sm leading-relaxed text-white/60">
                Synkra builds AI automation systems for South African businesses
                — voice, WhatsApp, lead automation, and more.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-block text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                Get in touch →
              </Link>
              <p className="label-tag mt-10">A Capacitiq Group company</p>
            </div>

            <div>
              <p className="label-tag mb-5">Services</p>
              <ul className="space-y-3">
                {SERVICES.map((s) => (
                  <li key={s.label}>
                    <Link
                      to={s.to}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-tag mb-5">Company</p>
              <ul className="space-y-3">
                {COMPANY.map((c, i) => (
                  <li key={`${c.label}-${i}`}>
                    <Link
                      to={c.to}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-white/5 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label-tag">
                Synkra. South Africa. All rights reserved.
              </p>
              <p className="label-tag">© {year}</p>
            </div>
          </div>

          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[12rem] font-black leading-none tracking-tighter text-white/[0.06] lg:text-[18rem]"
          >
            SYNKRA
          </span>
        </div>
      </div>
    </footer>
  );
}
