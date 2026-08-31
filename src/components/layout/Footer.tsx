import { Link } from "@tanstack/react-router";

const SERVICES = [
  { to: "/services/ai-voice-agent", label: "AI Voice Agent" },
  { to: "/services/speed-to-lead", label: "Speed to Lead" },
  { to: "/services/lead-reactivation", label: "Lead Reactivation" },
  { to: "/services/custom-agentic-ai", label: "Custom Agentic AI" },
];

const UTILITIES = [
  { to: "/utilities/qr-code-generator", label: "QR Code Generator" },
  { to: "/utilities/background-remover", label: "Background Remover" },
  { to: "/utilities/image-compressor", label: "Image Compressor" },
  { to: "/utilities/image-converter", label: "Image Converter" },
  { to: "/utilities/file-compressor", label: "File Compressor" },
  { to: "/utilities/file-converter", label: "File Converter" },
  { to: "/utilities/csv-cleaner", label: "CSV Cleaner" },
  { to: "/utilities/email-signature-generator", label: "Email Signature Generator" },
];

const COMPANY = [
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/help", label: "Help Centre" },
  { to: "/partner", label: "Partner With Us" },
  { to: "/contact", label: "Contact" },
  { to: "/admin/login", label: "Sign In" },
];

const LEGAL = [
  { to: "/legal/privacy-policy", label: "Privacy Policy" },
  { to: "/legal/terms-of-service", label: "Terms of Service" },
  { to: "/legal/refund-policy", label: "Refund Policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 pt-12 lg:px-8">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#252430] p-8 pb-40 lg:p-14 lg:pb-56">
          <div className="relative z-10 grid gap-12 lg:grid-cols-5">
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
              <p className="label-tag mb-5">Free Utilities</p>
              <ul className="space-y-3">
                {UTILITIES.map((u) => (
                  <li key={u.label}>
                    <Link
                      to={u.to}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {u.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-tag mb-5">Company</p>
              <ul className="space-y-3">
                {COMPANY.map((c) => (
                  <li key={c.label}>
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

            <div>
              <p className="label-tag mb-5">Legal</p>
              <ul className="space-y-3">
                {LEGAL.map((c) => (
                  <li key={c.label}>
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

          <div className="relative z-10 mt-14 border-t border-white/5 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label-tag">
                Synkra. South Africa. All rights reserved.
              </p>
              <p className="label-tag">© {year}</p>
            </div>
          </div>

          <img
            aria-hidden
            src="https://res.cloudinary.com/dewvhnks3/image/upload/v1783084829/1000104657-removebg-preview_z20unp.png"
            alt=""
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto w-[92%] max-w-[1200px] select-none opacity-[0.10]"
          />
        </div>
      </div>
    </footer>
  );
}
