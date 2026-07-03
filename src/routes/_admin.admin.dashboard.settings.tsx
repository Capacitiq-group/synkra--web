import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listAdminUsers, inviteAdmin, removeAdmin, meIsAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const opts = queryOptions({ queryKey: ["admin", "admin-users"], queryFn: () => listAdminUsers() });
const meOpts = queryOptions({ queryKey: ["admin", "me"], queryFn: () => meIsAdmin() });

export const Route = createFileRoute("/_admin/admin/dashboard/settings")({
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(opts),
    context.queryClient.ensureQueryData(meOpts),
  ]),
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useSuspenseQuery(opts);
  const { data: me } = useSuspenseQuery(meOpts);
  const qc = useQueryClient();
  const inviteFn = useServerFn(inviteAdmin);
  const removeFn = useServerFn(removeAdmin);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const invite = useMutation({
    mutationFn: () => inviteFn({ data: { email, full_name: name || undefined } }),
    onSuccess: () => { toast.success("Invited"); setEmail(""); setName(""); qc.invalidateQueries({ queryKey: ["admin", "admin-users"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (userId: string) => removeFn({ data: { userId } }),
    onSuccess: () => { toast.success("Removed"); qc.invalidateQueries({ queryKey: ["admin", "admin-users"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  async function unenrollMfa() {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    if (!totp) return toast.error("No factor to remove");
    if (!confirm("Remove your MFA factor? You'll need to re-enroll next sign-in.")) return;
    const r = await supabase.auth.mfa.unenroll({ factorId: totp.id });
    if (r.error) toast.error(r.error.message); else toast.success("MFA removed");
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="text-lg font-semibold mb-4">Your account</div>
        <div className="text-sm">Email: <span className="text-[color:var(--color-admin-text-muted)]">{me.email}</span></div>
        <div className="mt-4"><button className="admin-btn-secondary" onClick={unenrollMfa}>Reset MFA</button></div>
      </div>

      <div className="admin-card">
        <div className="text-lg font-semibold mb-4">Invite admin</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="admin-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="admin-input" placeholder="Full name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mt-3 flex justify-end">
          <button className="admin-btn-primary" onClick={() => invite.mutate()} disabled={!email || invite.isPending}>{invite.isPending ? "Inviting…" : "Invite"}</button>
        </div>
        <p className="mt-3 text-xs text-[color:var(--color-admin-text-muted)]">Requires SMTP configured in Supabase. If the user already exists, they'll be promoted.</p>
      </div>

      <div className="admin-card">
        <div className="text-lg font-semibold mb-4">Admins</div>
        <table className="admin-table">
          <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
            <tr><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Last sign-in</th><th className="py-2"></th></tr>
          </thead>
          <tbody>
            {data.map((u: any) => (
              <tr key={u.id} className="border-t border-[color:var(--color-admin-border)]">
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.full_name ?? "—"}</td>
                <td className="py-2 pr-4">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}</td>
                <td className="py-2">
                  {u.id !== me.userId && <button className="text-xs text-[color:var(--color-admin-danger)]" onClick={() => { if (confirm("Remove admin?")) remove.mutate(u.id); }}>Remove</button>}
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No admins yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
