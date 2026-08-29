import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { pb } from "@/integrations/pocketbase/client";

export const Route = createFileRoute("/admin/mfa")({
  ssr: false,
  head: () => ({ meta: [{ title: "Verify — Synkra Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: MfaPage,
});

function MfaPage() {
  const nav = useNavigate();
  const [otpId, setOtpId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(true);
  const sentOnce = useRef(false);

  useEffect(() => {
    const mfaId = sessionStorage.getItem("synkra_admin_mfa_id");
    const storedEmail = sessionStorage.getItem("synkra_admin_mfa_email");
    if (!mfaId || !storedEmail) {
      nav({ to: "/admin/login" });
      return;
    }
    setEmail(storedEmail);
    if (sentOnce.current) return;
    sentOnce.current = true;
    (async () => {
      try {
        const result = await pb.collection("admin_users").requestOTP(storedEmail);
        setOtpId(result.otpId);
      } catch (e: any) {
        setErr(e?.message ?? "Could not send the verification code.");
      } finally {
        setSending(false);
      }
    })();
  }, [nav]);

  async function resend() {
    if (!email) return;
    setSending(true);
    setErr(null);
    try {
      const result = await pb.collection("admin_users").requestOTP(email);
      setOtpId(result.otpId);
    } catch (e: any) {
      setErr(e?.message ?? "Could not resend the code.");
    } finally {
      setSending(false);
    }
  }

  async function verify() {
    const mfaId = sessionStorage.getItem("synkra_admin_mfa_id");
    if (!otpId || !mfaId) return;
    setBusy(true);
    setErr(null);
    try {
      await pb.collection("admin_users").authWithOTP(otpId, code, { mfaId });
      sessionStorage.removeItem("synkra_admin_mfa_id");
      sessionStorage.removeItem("synkra_admin_mfa_email");
      nav({ to: "/admin/dashboard" });
    } catch (e: any) {
      setErr(e?.message ?? "Invalid or expired code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-scope flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md admin-card">
        <div className="text-xs font-semibold tracking-widest text-[color:var(--color-admin-text-muted)] uppercase">Verify it's you</div>
        <h1 className="mt-2 text-2xl font-semibold">Enter the code we emailed you</h1>
        {email && (
          <p className="mt-2 text-sm text-[color:var(--color-admin-text-muted)]">
            Sent to {email}. {sending ? "Sending…" : "Check your inbox."}
          </p>
        )}
        <div className="mt-6 space-y-4">
          <div>
            <label className="admin-label">6-digit code</label>
            <input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="admin-input tracking-[0.4em] text-center text-xl" />
          </div>
          {err && <div className="text-sm text-[color:var(--color-admin-danger)]">{err}</div>}
          <button onClick={verify} disabled={busy || sending || !otpId || code.length !== 6} className="admin-btn-primary w-full">
            {busy ? "Verifying…" : "Verify"}
          </button>
          <button type="button" onClick={resend} disabled={sending} className="w-full text-xs text-[color:var(--color-admin-text-muted)] hover:text-[color:var(--color-admin-accent)]">
            {sending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
