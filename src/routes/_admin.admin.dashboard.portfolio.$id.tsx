import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getPortfolio, upsertPortfolio } from "@/lib/admin.functions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";

const opts = (id: string) => queryOptions({
  queryKey: ["admin", "portfolio", id],
  queryFn: () => getPortfolio({ data: { id } }),
});

export const Route = createFileRoute("/_admin/admin/dashboard/portfolio/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(opts(params.id)),
  component: PortfolioEditor,
});

function PortfolioEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts(id));

  const [f, setF] = useState({
    slug: data?.slug ?? "",
    title: data?.title ?? "",
    client_name: data?.client_name ?? "",
    category: data?.category ?? "",
    summary: data?.summary ?? "",
    challenge: data?.challenge ?? "",
    solution: data?.solution ?? "",
    outcome: data?.outcome ?? "",
    images: (data?.images ?? []) as string[],
    aspect_ratio: data?.aspect_ratio ?? "16/9",
    disclaimer: data?.disclaimer ?? "",
    services: ((data?.services ?? []) as string[]).join(", "),
    status: (data?.status ?? "draft") as any,
    sort_order: data?.sort_order ?? 0,
  });

  const saveFn = useServerFn(upsertPortfolio);
  const save = useMutation({
    mutationFn: () => saveFn({ data: {
      ...(isNew ? {} : { id }),
      slug: f.slug, title: f.title,
      client_name: f.client_name || null, category: f.category || null, summary: f.summary || null,
      challenge: f.challenge || null, solution: f.solution || null, outcome: f.outcome || null,
      images: f.images, aspect_ratio: f.aspect_ratio || null, disclaimer: f.disclaimer || null,
      services: f.services.split(",").map((s) => s.trim()).filter(Boolean),
      status: f.status, sort_order: Number(f.sort_order) || 0,
    } }),
    onSuccess: (row: any) => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "portfolio"] });
      if (isNew && row?.id) nav({ to: "/admin/dashboard/portfolio/$id" as any, params: { id: row.id } as any });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <Link to={"/admin/dashboard/portfolio" as any} className="text-sm text-[color:var(--color-admin-text-muted)] hover:text-[color:var(--color-admin-accent)]">← Back</Link>

      <div className="admin-card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="admin-label">Title</label><input className="admin-input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><label className="admin-label">Slug</label><input className="admin-input" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="skoon" /></div>
          <div><label className="admin-label">Client name</label><input className="admin-input" value={f.client_name} onChange={(e) => setF({ ...f, client_name: e.target.value })} /></div>
          <div><label className="admin-label">Category</label><input className="admin-input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-input" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
              <option>draft</option><option>published</option><option>archived</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Aspect ratio</label>
            <select className="admin-input" value={f.aspect_ratio} onChange={(e) => setF({ ...f, aspect_ratio: e.target.value })}>
              <option value="16/9">16/9</option><option value="4/3">4/3</option><option value="1/1">1/1</option><option value="9/16">9/16</option><option value="3/4">3/4</option>
            </select>
          </div>
        </div>
        <div><label className="admin-label">Summary</label><textarea className="admin-input min-h-20" value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className="admin-label">Challenge</label><textarea className="admin-input min-h-24" value={f.challenge} onChange={(e) => setF({ ...f, challenge: e.target.value })} /></div>
          <div><label className="admin-label">Solution</label><textarea className="admin-input min-h-24" value={f.solution} onChange={(e) => setF({ ...f, solution: e.target.value })} /></div>
          <div><label className="admin-label">Outcome</label><textarea className="admin-input min-h-24" value={f.outcome} onChange={(e) => setF({ ...f, outcome: e.target.value })} /></div>
        </div>
        <div><label className="admin-label">Services (comma-separated slugs)</label><input className="admin-input" value={f.services} onChange={(e) => setF({ ...f, services: e.target.value })} /></div>
        <div><label className="admin-label">Disclaimer</label><input className="admin-input" value={f.disclaimer} onChange={(e) => setF({ ...f, disclaimer: e.target.value })} /></div>
        <div>
          <label className="admin-label">Images</label>
          <ImageUpload bucket="portfolio-images" multiple value={f.images} onChange={(v) => setF({ ...f, images: v as string[] })} />
        </div>
        <div className="flex justify-end">
          <button className="admin-btn-primary" onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
