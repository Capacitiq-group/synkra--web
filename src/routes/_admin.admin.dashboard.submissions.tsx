import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listSubmissions, updateSubmissionStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

const opts = queryOptions({ queryKey: ["admin", "submissions"], queryFn: () => listSubmissions() });

export const Route = createFileRoute("/_admin/admin/dashboard/submissions")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const updateFn = useServerFn(updateSubmissionStatus);
  const mut = useMutation({
    mutationFn: (v: { id: string; status: any }) => updateFn({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "submissions"] }); qc.invalidateQueries({ queryKey: ["admin", "overview"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e.message),
  });
  const [filter, setFilter] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const filtered = data.filter((r: any) => (filter === "all" || r.status === filter) && (type === "all" || r.form_type === type));
  const [open, setOpen] = useState<any | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-input max-w-xs">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
          <option value="converted">Converted</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="admin-input max-w-xs">
          <option value="all">All types</option>
          <option value="contact">Contact</option>
          <option value="quote">Quote</option>
          <option value="partner_agency">Partner (agency)</option>
          <option value="partner_referral">Partner (referral)</option>
        </select>
        <div className="ml-auto text-sm text-[color:var(--color-admin-text-muted)] self-center">{filtered.length} results</div>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead className="text-left text-[color:var(--color-admin-text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Date</th><th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: any) => (
              <tr key={r.id} className="border-t border-[color:var(--color-admin-border)]">
                <td className="py-2 pr-4">{r.form_type}</td>
                <td className="py-2 pr-4">{r.name ?? "—"}</td>
                <td className="py-2 pr-4">{r.email ?? "—"}</td>
                <td className="py-2 pr-4">{r.company ?? "—"}</td>
                <td className="py-2 pr-4"><span className="status-badge" style={{ background: r.status === "new" ? "#56d72220" : "#26263280", color: r.status === "new" ? "#56d722" : "#8b8b98" }}>{r.status}</span></td>
                <td className="py-2 pr-4 text-[color:var(--color-admin-text-muted)]">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => { setOpen(r); if (r.status === "new") mut.mutate({ id: r.id, status: "read" }); }} className="text-xs text-[color:var(--color-admin-accent)]">View</button>
                    {r.status !== "archived" && <button onClick={() => mut.mutate({ id: r.id, status: "archived" })} className="text-xs text-[color:var(--color-admin-text-muted)]">Archive</button>}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No submissions.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60" onClick={() => setOpen(null)}>
          <div className="admin-card max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="admin-label">{open.form_type}</div>
                <div className="text-lg font-semibold">{open.name ?? "Anonymous"}</div>
              </div>
              <button onClick={() => setOpen(null)} className="text-[color:var(--color-admin-text-muted)]">✕</button>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[["Email", open.email], ["Phone", open.phone], ["Company", open.company], ["Date", new Date(open.created_at).toLocaleString()]].map(([k, v]) => (
                <div key={k as string}><dt className="admin-label">{k}</dt><dd>{(v as any) ?? "—"}</dd></div>
              ))}
            </dl>
            {open.message && <div className="mt-4"><div className="admin-label">Message</div><p className="text-sm whitespace-pre-wrap">{open.message}</p></div>}
            {open.payload && Object.keys(open.payload).length > 0 && (
              <div className="mt-4"><div className="admin-label">Payload</div>
                <pre className="text-xs bg-[color:var(--color-admin-surface-2)] p-3 rounded overflow-auto">{JSON.stringify(open.payload, null, 2)}</pre>
              </div>
            )}
            <div className="mt-6 flex gap-2 justify-end">
              {["new", "read", "archived", "converted"].map((s) => (
                <button key={s} onClick={() => mut.mutate({ id: open.id, status: s as any })} className={open.status === s ? "admin-btn-primary" : "admin-btn-secondary"}>
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="text-xs text-[color:var(--color-admin-text-muted)]"><Link to={"/admin/dashboard" as any} className="hover:text-[color:var(--color-admin-accent)]">← Back to overview</Link></div>
    </div>
  );
}
