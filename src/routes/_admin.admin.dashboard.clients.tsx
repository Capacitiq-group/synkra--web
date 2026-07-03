import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listClients } from "@/lib/admin.functions";

const opts = queryOptions({ queryKey: ["admin", "clients"], queryFn: () => listClients() });

export const Route = createFileRoute("/_admin/admin/dashboard/clients")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: ClientsPage,
});

function ClientsPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-[color:var(--color-admin-text-muted)]">{data.length} clients</div>
        <Link to={"/admin/dashboard/clients/new" as any} className="admin-btn-primary">+ New client</Link>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
            <tr>
              <th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Contact</th><th className="py-2 pr-4">Service</th><th className="py-2 pr-4">Plan</th><th className="py-2 pr-4">Credits</th><th className="py-2 pr-4">Status</th><th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((c: any) => (
              <tr key={c.id} className="border-t border-[color:var(--color-admin-border)]">
                <td className="py-2 pr-4 font-medium">{c.company_name}</td>
                <td className="py-2 pr-4">{c.contact_name ?? "—"}<div className="text-xs text-[color:var(--color-admin-text-muted)]">{c.email ?? ""}</div></td>
                <td className="py-2 pr-4">{c.service_slug ?? "—"}</td>
                <td className="py-2 pr-4 capitalize">{c.plan_tier ?? "—"}</td>
                <td className="py-2 pr-4">{c.credit_balance}</td>
                <td className="py-2 pr-4"><span className="status-badge" style={{ background: c.status === "active" ? "#56d72220" : "#ef444420", color: c.status === "active" ? "#56d722" : "#ef4444" }}>{c.status}</span></td>
                <td className="py-2"><Link to={"/admin/dashboard/clients/$id" as any} params={{ id: c.id } as any} className="text-xs text-[color:var(--color-admin-accent)]">Open →</Link></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No clients yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
