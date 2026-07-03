import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    setBusy(true); setErr(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr(error.message);
    // check MFA state
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal2") {
      nav({ to: "/admin/mfa" });
    } else {
      nav({ to: "/admin/mfa" }); // enroll if none
    }
    void data;
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
