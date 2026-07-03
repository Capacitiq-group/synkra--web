import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPortfolio, deletePortfolio } from "@/lib/admin.functions";
import { toast } from "sonner";

const opts = queryOptions({ queryKey: ["admin", "portfolio"], queryFn: () => listPortfolio() });

export const Route = createFileRoute("/_admin/admin/dashboard/portfolio")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: PortfolioList,
});

function PortfolioList() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const delFn = useServerFn(deletePortfolio);
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "portfolio"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-[color:var(--color-admin-text-muted)]">{data.length} items</div>
        <Link to={"/admin/dashboard/portfolio/$id" as any} params={{ id: "new" } as any} className="admin-btn-primary">+ New item</Link>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
            <tr><th className="py-2 pr-4">Title</th><th className="py-2 pr-4">Client</th><th className="py-2 pr-4">Category</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Slug</th><th className="py-2"></th></tr>
          </thead>
          <tbody>
            {data.map((p: any) => (
              <tr key={p.id} className="border-t border-[color:var(--color-admin-border)]">
                <td className="py-2 pr-4 font-medium">{p.title}</td>
                <td className="py-2 pr-4">{p.client_name ?? "—"}</td>
                <td className="py-2 pr-4">{p.category ?? "—"}</td>
                <td className="py-2 pr-4"><span className="status-badge" style={{ background: p.status === "published" ? "#56d72220" : "#26263280", color: p.status === "published" ? "#56d722" : "#8b8b98" }}>{p.status}</span></td>
                <td className="py-2 pr-4 font-mono text-xs text-[color:var(--color-admin-text-muted)]">{p.slug}</td>
                <td className="py-2 flex gap-3">
                  <Link to={"/admin/dashboard/portfolio/$id" as any} params={{ id: p.id } as any} className="text-xs text-[color:var(--color-admin-accent)]">Edit</Link>
                  <button onClick={() => { if (confirm("Delete?")) del.mutate(p.id); }} className="text-xs text-[color:var(--color-admin-danger)]">Delete</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No portfolio items yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
