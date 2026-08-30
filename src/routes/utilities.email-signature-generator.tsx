import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/lib/seo";
import { postForText, UtilitiesApiError } from "@/lib/utilitiesApi";

export const Route = createFileRoute("/utilities/email-signature-generator")({
  head: () =>
    buildHead({
      title: "Email Signature Generator",
      description:
        "Build a clean HTML email signature you can paste into any mail client, free. No account required.",
      path: "/utilities/email-signature-generator",
    }),
  component: Page,
});

function Page() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [accentColor, setAccentColor] = useState("#1a1a2e");

  const [html, setHtml] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await postForText("/email-signature/generate", {
        name,
        job_title: jobTitle || null,
        company: company || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        logo_url: logoUrl || null,
        linkedin_url: linkedinUrl || null,
        accent_color: accentColor,
      });
      setHtml(result);
    } catch (e) {
      setError(e instanceof UtilitiesApiError ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copyHtml() {
    if (!html) return;
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Free Tool</p>
        <h1 className="heading-display mt-6 max-w-[800px]">Email Signature Generator</h1>
        <p className="body-text mt-6 max-w-[600px]">
          Build a clean HTML email signature you can paste into Gmail,
          Outlook, or any mail client. Your logo, if you add one, must be a
          publicly reachable image link — this tool doesn't accept uploads
          or host images for you.
        </p>
      </div>
      <div className="container-main"><div className="hairline" /></div>
      <div className="container-main section-padding">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="Full name *" value={name} onChange={setName} />
            <Field label="Job title" value={jobTitle} onChange={setJobTitle} />
            <Field label="Company" value={company} onChange={setCompany} />
            <Field label="Email" value={email} onChange={setEmail} type="email" />
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="Website" value={website} onChange={setWebsite} placeholder="https://" />
            <Field label="Logo URL (optional)" value={logoUrl} onChange={setLogoUrl} placeholder="https://example.com/logo.png" />
            <Field label="LinkedIn URL (optional)" value={linkedinUrl} onChange={setLinkedinUrl} />
            <div>
              <label className="label-tag block">Accent colour</label>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-white/10 bg-[#0f0f0f]" />
            </div>
            <button onClick={run} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Generating..." : "Generate signature"}
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div>
            <p className="label-tag">Preview</p>
            <div className="mt-3 min-h-[160px] rounded-2xl border border-white/5 bg-white p-6">
              {html ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-black/30">Your signature will appear here</p>
              )}
            </div>
            {html && (
              <button onClick={copyHtml} className="btn-secondary mt-4">
                {copied ? "Copied!" : "Copy HTML"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label-tag block">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-brand-green)] focus:outline-none"
      />
    </label>
  );
}
