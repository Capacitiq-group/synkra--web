import { useEffect, useState } from "react";
import { z } from "zod";

const INTEREST_OPTIONS = [
  "AI Voice Agent",
  "AI Web Widget Agent",
  "AI WhatsApp Agent",
  "Speed to Lead System",
  "Lead Reactivation Campaign",
  "AI Knowledge Base",
  "Partnership opportunity",
  "Something else",
];

// Map URL-param service values (from ServicePageLayout) to the contact
// dropdown labels above.
const SERVICE_ALIASES: Record<string, string> = {
  "AI Voice Agent": "AI Voice Agent",
  "AI Web Widget": "AI Web Widget Agent",
  "AI WhatsApp Agent": "AI WhatsApp Agent",
  "Speed to Lead": "Speed to Lead System",
  "Lead Reactivation": "Lead Reactivation Campaign",
  "AI Knowledge Base": "AI Knowledge Base",
};

const Schema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  business_name: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(1, "Required").max(40),
  interest: z.string().min(1, "Required"),
  message: z.string().trim().min(10, "Tell us a little about your project").max(4000),
  referral_source: z.string().optional(),
});

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  preselectService,
  preselectTier,
}: {
  preselectService?: string;
  preselectTier?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interest, setInterest] = useState<string>("");

  useEffect(() => {
    if (preselectService) {
      const mapped =
        SERVICE_ALIASES[preselectService] ??
        (INTEREST_OPTIONS.includes(preselectService)
          ? preselectService
          : "Something else");
      setInterest(mapped);
    }
  }, [preselectService]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: String(fd.get("full_name") ?? ""),
      business_name: String(fd.get("business_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      message: String(fd.get("message") ?? ""),
      referral_source: String(fd.get("referral_source") ?? ""),
    };
    const parsed = Schema.safeParse(raw);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0];
        if (typeof k === "string" && !map[k]) map[k] = i.message;
      }
      setErrors(map);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form_type: "contact",
          name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          company: parsed.data.business_name,
          message: parsed.data.message,
          payload: {
            interest: parsed.data.interest,
            referral_source: parsed.data.referral_source || null,
            tier: preselectTier || null,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card-dark text-left">
        <p className="heading-card green-text">Message received.</p>
        <p className="body-sm mt-4">
          We will be in touch within 24 hours on business days. If your enquiry
          is urgent, email us directly at{" "}
          <a
            href="mailto:synkra@capacitiqgroup.co.za"
            className="green-text underline"
          >
            synkra@capacitiqgroup.co.za
          </a>
          .
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#56d722] focus:outline-none transition-colors";
  const labelCls = "label-tag block mb-2 text-white/80";
  const errCls = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 text-left">
      <div>
        <label htmlFor="full_name" className={labelCls}>Full name *</label>
        <input id="full_name" name="full_name" required className={inputCls} />
        {errors.full_name && <p className={errCls}>{errors.full_name}</p>}
      </div>
      <div>
        <label htmlFor="business_name" className={labelCls}>Business name *</label>
        <input id="business_name" name="business_name" required className={inputCls} />
        {errors.business_name && <p className={errCls}>{errors.business_name}</p>}
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>Email address *</label>
        <input id="email" name="email" type="email" required className={inputCls} />
        {errors.email && <p className={errCls}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className={labelCls}>Phone number *</label>
        <input id="phone" name="phone" type="tel" required className={inputCls} />
        {errors.phone && <p className={errCls}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="interest" className={labelCls}>
          What are you interested in *
        </label>
        <select
          id="interest"
          name="interest"
          required
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className={inputCls}
        >
          <option value="" disabled>Select an option</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o} value={o} className="bg-[#0f0f0f]">
              {o}
            </option>
          ))}
        </select>
        {preselectTier && (
          <p className="body-sm green-text mt-2">
            You selected the {preselectTier} tier. You can change this below if
            needed.
          </p>
        )}
        {errors.interest && <p className={errCls}>{errors.interest}</p>}
      </div>
      <div>
        <label htmlFor="message" className={labelCls}>
          Tell us about your business and what you are trying to solve *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputCls}
        />
        {errors.message && <p className={errCls}>{errors.message}</p>}
      </div>
      <div>
        <label htmlFor="referral_source" className={labelCls}>
          How did you hear about Synkra
        </label>
        <select id="referral_source" name="referral_source" defaultValue="" className={inputCls}>
          <option value="">Select an option</option>
          {["Google", "LinkedIn", "Referred by someone", "Social media", "Other"].map((o) => (
            <option key={o} value={o} className="bg-[#0f0f0f]">{o}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      {status === "error" && (
        <p className="body-sm text-red-400">
          Something went wrong. Please try again or email us directly at{" "}
          <a
            href="mailto:synkra@capacitiqgroup.co.za"
            className="green-text underline"
          >
            synkra@capacitiqgroup.co.za
          </a>
          .
        </p>
      )}
    </form>
  );
}
