import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listAuditLog } from "@/lib/admin.functions";

const opts = queryOptions({ queryKey: ["admin", "audit"], queryFn: () => listAuditLog() });

export const Route = createFileRoute("/_admin/admin/dashboard/audit")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: AuditPage,
});

function AuditPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <div className="admin-card overflow-x-auto">
      <table className="admin-table">
        <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
          <tr>
            <th className="py-2 pr-4">When</th>
            <th className="py-2 pr-4">Actor</th>
            <th className="py-2 pr-4">Action</th>
            <th className="py-2 pr-4">Entity</th>
            <th className="py-2 pr-4">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} className="border-t border-[color:var(--color-admin-border)] align-top">
              <td className="py-2 pr-4 whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
              <td className="py-2 pr-4">{row.actor_email ?? row.actor_id?.slice(0, 8) ?? "—"}</td>
              <td className="py-2 pr-4 font-mono text-xs">{row.action}</td>
              <td className="py-2 pr-4 text-xs">{row.entity_type ? `${row.entity_type}:${(row.entity_id ?? "").slice(0, 8)}` : "—"}</td>
              <td className="py-2 pr-4 text-xs text-[color:var(--color-admin-text-muted)]">
                <pre className="whitespace-pre-wrap break-all max-w-md">{JSON.stringify(row.metadata ?? {}, null, 0)}</pre>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No activity yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
