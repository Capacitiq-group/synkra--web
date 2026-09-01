import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { buildHead } from "@/lib/seo";
import { submitTalkToUs } from "@/lib/talkToUs.functions";

const SearchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/talk-to-us")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () =>
    buildHead({
      title: "Talk to Us",
      description:
        "Book a short call with the Synkra team. Tell us what you need and we'll find a time to talk.",
      path: "/talk-to-us",
    }),
  component: TalkToUsPage,
});

function TalkToUsPage() {
  const { service } = Route.useSearch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceInterest, setServiceInterest] = useState(service ?? "");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitTalkToUs({
        data: {
          name,
          email,
          phone,
          company,
          service_interest: serviceInterest,
          preferred_time: preferredTime,
          message,
        },
      });
      if (res.ok) setDone(true);
      else setError(res.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="bg-[#0a0a0a]">
        <div className="container-main section-padding text-center">
          <p className="label-tag text-[var(--color-brand-green)]">Request received</p>
          <h1 className="heading-display mt-6">Thanks, {name.split(" ")[0]}.</h1>
          <p className="body-text mx-auto mt-6 max-w-[480px]">
            We've got your request and will be in touch shortly to find a
            time to talk. Check your inbox for a confirmation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Talk to Us</p>
        <h1 className="heading-display mt-6 max-w-[700px]">
          Book a short call with the Synkra team.
        </h1>
        <p className="body-text mt-6 max-w-[520px]">
          Tell us a bit about what you need. No obligation, no sales
          pressure, usually 10 to 15 minutes to figure out if and how we
          can help.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <form onSubmit={submit} className="mx-auto max-w-[560px] space-y-5">
          <Field label="Full name" required value={name} onChange={setName} />
          <Field label="Email" required type="email" value={email} onChange={setEmail} />
          <Field label="Phone number" required value={phone} onChange={setPhone} />
          <Field label="Company name" required value={company} onChange={setCompany} />
          <Field label="What would you like to discuss?" required value={serviceInterest} onChange={setServiceInterest} placeholder="e.g. AI Voice Agent, Speed to Lead, not sure yet" />
          <Field label="Preferred day or time for a call (optional)" value={preferredTime} onChange={setPreferredTime} placeholder="e.g. Tuesday afternoon" />
          <TextArea label="Anything else? (optional)" value={message} onChange={setMessage} />

          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? "Submitting..." : "Request a call"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, required, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}{required && <span className="text-[var(--color-brand-green)]"> *</span>}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-brand-green)] focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white focus:border-[var(--color-brand-green)] focus:outline-none"
      />
    </label>
  );
}
