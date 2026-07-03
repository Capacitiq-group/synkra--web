import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listPartners, approvePartner, updatePartner } from "@/lib/admin.functions";
import { toast } from "sonner";

const opts = queryOptions({ queryKey: ["admin", "partners"], queryFn: () => listPartners() });

export const Route = createFileRoute("/_admin/admin/dashboard/partners")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: PartnersPage,
});

function PartnersPage() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const approveFn = useServerFn(approvePartner);
  const updateFn = useServerFn(updatePartner);
  const [tab, setTab] = useState<"applications" | "approved">("applications");

  const approve = useMutation({
    mutationFn: (v: any) => approveFn({ data: v }),
    onSuccess: () => { toast.success("Approved"); qc.invalidateQueries({ queryKey: ["admin", "partners"] }); qc.invalidateQueries({ queryKey: ["admin", "submissions"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: (v: any) => updateFn({ data: v }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", "partners"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["applications", "approved"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? "admin-btn-primary" : "admin-btn-secondary"}>
            {t === "applications" ? `Applications (${data.applications.length})` : `Approved (${data.approved.length})`}
          </button>
        ))}
      </div>

      {tab === "applications" && (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
              <tr><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Status</th><th className="py-2"></th></tr>
            </thead>
            <tbody>
              {data.applications.map((a: any) => (
                <tr key={a.id} className="border-t border-[color:var(--color-admin-border)]">
                  <td className="py-2 pr-4">{a.form_type.replace("partner_", "")}</td>
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4">{a.email}</td>
                  <td className="py-2 pr-4">{a.company ?? "—"}</td>
                  <td className="py-2 pr-4">{a.status}</td>
                  <td className="py-2">
                    {a.status !== "converted" ? (
                      <button className="text-xs text-[color:var(--color-admin-accent)]" onClick={() => {
                        const rate = Number(prompt("Commission rate %", "10") ?? 10);
                        approve.mutate({
                          submission_id: a.id,
                          partner_type: a.form_type === "partner_agency" ? "agency" : "referral",
                          name: a.name, email: a.email, phone: a.phone, company: a.company,
                          commission_rate: rate,
                        });
                      }}>Approve</button>
                    ) : <span className="text-xs text-[color:var(--color-admin-text-muted)]">Converted</span>}
                  </td>
                </tr>
              ))}
              {data.applications.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No applications.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "approved" && (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
              <tr><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Commission</th><th className="py-2 pr-4">Status</th><th className="py-2"></th></tr>
            </thead>
            <tbody>
              {data.approved.map((p: any) => (
                <tr key={p.id} className="border-t border-[color:var(--color-admin-border)]">
                  <td className="py-2 pr-4 font-medium">{p.name}<div className="text-xs text-[color:var(--color-admin-text-muted)]">{p.email}</div></td>
                  <td className="py-2 pr-4 capitalize">{p.partner_type}</td>
                  <td className="py-2 pr-4">
                    <input type="number" defaultValue={p.commission_rate} className="admin-input max-w-24"
                      onBlur={(e) => update.mutate({ id: p.id, commission_rate: Number(e.target.value) })} />%
                  </td>
                  <td className="py-2 pr-4">
                    <select className="admin-input max-w-32" defaultValue={p.status} onChange={(e) => update.mutate({ id: p.id, status: e.target.value as any })}>
                      <option>active</option><option>paused</option><option>terminated</option>
                    </select>
                  </td>
                  <td className="py-2"></td>
                </tr>
              ))}
              {data.approved.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No approved partners.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
