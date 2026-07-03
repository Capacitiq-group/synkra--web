import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/mfa")({
  ssr: false,
  head: () => ({ meta: [{ title: "MFA — Synkra Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: MfaPage,
});

function MfaPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"loading" | "verify" | "enroll">("loading");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return nav({ to: "/admin/login" });
      const { data } = await supabase.auth.mfa.listFactors();
      const totp = data?.totp?.find((f) => f.status === "verified");
      if (totp) {
        // create challenge
        const ch = await supabase.auth.mfa.challenge({ factorId: totp.id });
        if (ch.error) return setErr(ch.error.message);
        setFactorId(totp.id);
        setChallengeId(ch.data.id);
        setMode("verify");
      } else {
        const en = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Admin TOTP" });
        if (en.error) return setErr(en.error.message);
        setFactorId(en.data.id);
        setQr(en.data.totp.uri);
        setSecret(en.data.totp.secret);
        setMode("enroll");
      }
    })();
  }, [nav]);

  async function verify() {
    if (!factorId) return;
    setBusy(true); setErr(null);
    if (mode === "enroll") {
      const ch = await supabase.auth.mfa.challenge({ factorId });
      if (ch.error) { setBusy(false); return setErr(ch.error.message); }
      const v = await supabase.auth.mfa.verify({ factorId, challengeId: ch.data.id, code });
      setBusy(false);
      if (v.error) return setErr(v.error.message);
    } else {
      if (!challengeId) return;
      const v = await supabase.auth.mfa.verify({ factorId, challengeId, code });
      setBusy(false);
      if (v.error) return setErr(v.error.message);
    }
    nav({ to: "/admin/dashboard" });
  }

  return (
    <div className="admin-scope flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md admin-card">
        <div className="text-xs font-semibold tracking-widest text-[color:var(--color-admin-text-muted)] uppercase">Two-factor</div>
        <h1 className="mt-2 text-2xl font-semibold">{mode === "enroll" ? "Set up authenticator" : "Enter code"}</h1>
        {mode === "loading" && <p className="mt-4 text-sm text-[color:var(--color-admin-text-muted)]">Loading…</p>}
        {mode === "enroll" && qr && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-[color:var(--color-admin-text-muted)]">Scan with Google Authenticator, 1Password, or Authy.</p>
            <div className="bg-white p-4 rounded-lg inline-block"><QRCodeSVG value={qr} size={180} /></div>
            {secret && <div className="text-xs font-mono break-all text-[color:var(--color-admin-text-muted)]">Manual key: {secret}</div>}
          </div>
        )}
        <div className="mt-6 space-y-4">
          <div>
            <label className="admin-label">6-digit code</label>
            <input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="admin-input tracking-[0.4em] text-center text-xl" />
          </div>
          {err && <div className="text-sm text-[color:var(--color-admin-danger)]">{err}</div>}
          <button onClick={verify} disabled={busy || code.length !== 6} className="admin-btn-primary w-full">
            {busy ? "Verifying…" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
