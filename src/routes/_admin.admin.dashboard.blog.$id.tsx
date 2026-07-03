import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, lazy, Suspense } from "react";
import { getBlogPost, upsertBlog } from "@/lib/admin.functions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";

const MDEditor = lazy(() => import("@uiw/react-md-editor").then((m) => ({ default: m.default })));

const opts = (id: string) => queryOptions({
  queryKey: ["admin", "blog", id],
  queryFn: () => getBlogPost({ data: { id } }),
});

export const Route = createFileRoute("/_admin/admin/dashboard/blog/$id")({
  ssr: false,
  loader: ({ context, params }) => context.queryClient.ensureQueryData(opts(params.id)),
  component: BlogEditor,
});

function BlogEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts(id));

  const [f, setF] = useState({
    slug: data?.slug ?? "",
    title: data?.title ?? "",
    excerpt: data?.excerpt ?? "",
    content_md: data?.content_md ?? "",
    cover_image_url: data?.cover_image_url ?? "",
    author_name: data?.author_name ?? "",
    tags: ((data?.tags ?? []) as string[]).join(", "),
    status: (data?.status ?? "draft") as any,
  });

  const saveFn = useServerFn(upsertBlog);
  const save = useMutation({
    mutationFn: () => saveFn({ data: {
      ...(isNew ? {} : { id }),
      slug: f.slug, title: f.title, excerpt: f.excerpt || null,
      content_md: f.content_md, cover_image_url: f.cover_image_url || null,
      author_name: f.author_name || null,
      tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),
      status: f.status,
    } }),
    onSuccess: (row: any) => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      if (isNew && row?.id) nav({ to: "/admin/dashboard/blog/$id" as any, params: { id: row.id } as any });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <Link to={"/admin/dashboard/blog" as any} className="text-sm text-[color:var(--color-admin-text-muted)] hover:text-[color:var(--color-admin-accent)]">← Back</Link>
      <div className="admin-card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="admin-label">Title</label><input className="admin-input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><label className="admin-label">Slug</label><input className="admin-input" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
          <div><label className="admin-label">Author</label><input className="admin-input" value={f.author_name} onChange={(e) => setF({ ...f, author_name: e.target.value })} /></div>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-input" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
              <option>draft</option><option>published</option><option>archived</option>
            </select>
          </div>
        </div>
        <div><label className="admin-label">Excerpt</label><textarea className="admin-input min-h-20" value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></div>
        <div><label className="admin-label">Tags (comma-separated)</label><input className="admin-input" value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></div>
        <div>
          <label className="admin-label">Cover image</label>
          <ImageUpload bucket="blog-images" value={f.cover_image_url} onChange={(v) => setF({ ...f, cover_image_url: v as string })} />
        </div>
        <div data-color-mode="dark">
          <label className="admin-label">Content (Markdown)</label>
          <Suspense fallback={<div className="text-sm text-[color:var(--color-admin-text-muted)]">Loading editor…</div>}>
            <MDEditor value={f.content_md} onChange={(v) => setF({ ...f, content_md: v ?? "" })} height={500} />
          </Suspense>
        </div>
        <div className="flex justify-end">
          <button className="admin-btn-primary" onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
