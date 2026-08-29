import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { pb } from "@/integrations/pocketbase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Synkra" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      // With MFA enabled on the admin_users collection, this ALWAYS throws
      // on success too — PocketBase requires a second factor before issuing
      // a valid token. A thrown error with response.mfaId means the
      // password was correct and a second factor (email OTP) is required.
      await pb.collection("admin_users").authWithPassword(email, password);
      // No mfaId thrown: MFA is not enabled on this collection. Treat as
      // fully authenticated.
      setBusy(false);
      nav({ to: "/admin/dashboard" });
    } catch (error: any) {
      setBusy(false);
      const mfaId = error?.response?.mfaId;
      if (!mfaId) {
        setErr(error?.message ?? "Invalid email or password");
        return;
      }
      sessionStorage.setItem("synkra_admin_mfa_id", mfaId);
      sessionStorage.setItem("synkra_admin_mfa_email", email);
      nav({ to: "/admin/mfa" });
    }
  }

  return (
    <div className="admin-scope flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md admin-card">
        <div className="mb-6">
          <div className="text-xs font-semibold tracking-widest text-[color:var(--color-admin-text-muted)] uppercase">Synkra Admin</div>
          <h1 className="mt-2 text-2xl font-semibold text-[color:var(--color-admin-text)]">Sign in</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" autoComplete="email" />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" autoComplete="current-password" />
          </div>
          {err && <div className="text-sm text-[color:var(--color-admin-danger)]">{err}</div>}
          <button type="submit" disabled={busy} className="admin-btn-primary w-full">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="mt-6 text-xs text-[color:var(--color-admin-text-muted)]">
          <Link to="/" className="hover:text-[color:var(--color-admin-accent)]">← Back to marketing site</Link>
        </div>
      </div>
    </div>
  );
}
