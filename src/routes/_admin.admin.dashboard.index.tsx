import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { overviewStats } from "@/lib/admin.functions";

const opts = queryOptions({ queryKey: ["admin", "overview"], queryFn: () => overviewStats() });

export const Route = createFileRoute("/_admin/admin/dashboard/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: OverviewPage,
});

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="admin-card">
      <div className="admin-label">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-[color:var(--color-admin-text)]">{value}</div>
      {hint && <div className="mt-1 text-xs text-[color:var(--color-admin-text-muted)]">{hint}</div>}
    </div>
  );
}

function OverviewPage() {
  const { data } = useSuspenseQuery(opts);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active clients" value={data.clientsActive} hint={`${data.clientsTotal} total`} />
        <Stat label="New submissions" value={data.submissionsNew} />
        <Stat label="Published portfolio" value={data.portfolioPublished} hint={`${data.portfolioTotal} total`} />
        <Stat label="Published posts" value={data.blogPublished} hint={`${data.blogTotal} total`} />
      </div>

      <div className="admin-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="admin-label">Submissions</div>
            <div className="text-lg font-semibold">Last 30 days</div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.submissionsTimeseries}>
              <CartesianGrid stroke="#262632" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8b8b98" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#8b8b98" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#14141c", border: "1px solid #262632", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="#56d722" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Recent submissions</div>
          <Link to={"/admin/dashboard/submissions" as any} className="text-sm text-[color:var(--color-admin-accent)]">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="text-left text-[color:var(--color-admin-text-muted)] text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Status</th><th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSubmissions.map((r: any) => (
                <tr key={r.id} className="border-t border-[color:var(--color-admin-border)]">
                  <td className="py-2 pr-4">{r.form_type}</td>
                  <td className="py-2 pr-4">{r.name ?? "—"}</td>
                  <td className="py-2 pr-4">{r.email ?? "—"}</td>
                  <td className="py-2 pr-4"><span className="status-badge" style={{ background: r.status === "new" ? "#56d72220" : "#26263280", color: r.status === "new" ? "#56d722" : "#8b8b98" }}>{r.status}</span></td>
                  <td className="py-2 text-[color:var(--color-admin-text-muted)]">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {data.recentSubmissions.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No submissions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
