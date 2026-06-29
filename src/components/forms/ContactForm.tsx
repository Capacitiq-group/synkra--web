import { useState } from "react";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little about your project").max(4000),
});

type Status = "idle" | "submitting" | "success" | "error";

const SERVICE_OPTIONS = [
  "Not sure yet",
  "AI Voice Agent",
  "AI Web Widget",
  "AI WhatsApp Agent",
  "Speed to Lead",
  "Lead Reactivation",
  "AI Knowledge Base",
  "Automated Hiring",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !map[key]) map[key] = issue.message;
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
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || undefined,
          company: parsed.data.company || undefined,
          message: parsed.data.message,
          payload: { service: parsed.data.service || null },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Submission failed");
      }
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-10">
        <p className="label-tag green-text">Message sent</p>
        <h2 className="heading-section mt-4">Thanks — we'll be in touch.</h2>
        <p className="body-text mt-4 max-w-prose">
          Your enquiry is in. A member of the Synkra team will reply from{" "}
          <span className="text-white">Synkra@capacitiqgroup.co.za</span> within
          one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-8"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#56d722] focus:outline-none transition-colors";
  const labelCls = "label-tag block mb-2 text-white/80";
  const errCls = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Full name *</label>
          <input id="name" name="name" autoComplete="name" required className={inputCls} />
          {errors.name && <p className={errCls}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email *</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
          {errors.email && <p className={errCls}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
          {errors.phone && <p className={errCls}>{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="company" className={labelCls}>Company</label>
          <input id="company" name="company" autoComplete="organization" className={inputCls} />
          {errors.company && <p className={errCls}>{errors.company}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="service" className={labelCls}>What are you interested in?</label>
        <select id="service" name="service" defaultValue="Not sure yet" className={inputCls}>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-[#0f0f0f]">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className={labelCls}>Tell us about your project *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={inputCls}
          placeholder="What does your business do, what are you trying to automate, and what does success look like?"
        />
        {errors.message && <p className={errCls}>{errors.message}</p>}
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage || "Something went wrong. Please try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary justify-center disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      <p className="body-sm">
        By submitting you agree to be contacted by the Synkra team. We never
        share your details.
      </p>
    </form>
  );
}
