import { useState, type ReactNode } from "react";
import { z } from "zod";

export type FieldDef =
  | {
      name: string;
      label: string;
      type: "text" | "email" | "tel" | "url";
      required?: boolean;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      rows?: number;
      required?: boolean;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
    };

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplicationForm({
  formType,
  fields,
  submitLabel,
  consentLabel,
  successHeading,
  successBody,
  errorBody,
}: {
  formType: string;
  fields: FieldDef[];
  submitLabel: string;
  consentLabel: ReactNode;
  successHeading: string;
  successBody: ReactNode;
  errorBody: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, string> = {};
    fields.forEach((f) => {
      raw[f.name] = String(fd.get(f.name) ?? "").trim();
    });

    // Basic validation
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((f) => {
      let s: z.ZodTypeAny = z.string();
      if (f.type === "email") s = z.string().email("Enter a valid email");
      if (f.required) s = (s as z.ZodString).min(1, "Required");
      shape[f.name] = s;
    });
    const parsed = z.object(shape).safeParse(raw);
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
      // Map common fields to the form_submissions schema; the rest go into payload.
      const known = new Set([
        "full_name",
        "email",
        "phone",
        "business_name",
        "message",
      ]);
      const payload: Record<string, string> = {};
      Object.entries(raw).forEach(([k, v]) => {
        if (!known.has(k) && k !== "message_alias") payload[k] = v;
      });

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form_type: formType,
          name: raw.full_name || undefined,
          email: raw.email || undefined,
          phone: raw.phone || undefined,
          company: raw.business_name || undefined,
          message: raw.message || raw.approach || undefined,
          payload,
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
      <div className="card-dark text-left max-w-[680px]">
        <p className="heading-card green-text">{successHeading}</p>
        <p className="body-sm mt-4">{successBody}</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-white/30 focus:border-[#56d722] focus:outline-none transition-colors";
  const labelCls = "label-tag block mb-2 text-white/80";
  const errCls = "mt-1 text-xs text-red-400";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6 max-w-[680px] text-left"
    >
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className={labelCls}>
            {f.label}
            {f.required ? " *" : ""}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              rows={f.rows ?? 3}
              required={f.required}
              placeholder={f.placeholder}
              className={inputCls}
            />
          ) : f.type === "select" ? (
            <select
              id={f.name}
              name={f.name}
              required={f.required}
              defaultValue=""
              className={inputCls}
            >
              <option value="" disabled>
                Select an option
              </option>
              {f.options.map((o) => (
                <option key={o} value={o} className="bg-[#0f0f0f]">
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required={f.required}
              placeholder={f.placeholder}
              className={inputCls}
            />
          )}
          {errors[f.name] && <p className={errCls}>{errors[f.name]}</p>}
        </div>
      ))}

      <label className="flex items-start gap-3 text-left">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#56d722]"
        />
        <span className="body-sm">{consentLabel}</span>
      </label>

      <button
        type="submit"
        disabled={!consent || status === "submitting"}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>

      {status === "error" && (
        <p className="body-sm text-red-400">{errorBody}</p>
      )}
    </form>
  );
}
