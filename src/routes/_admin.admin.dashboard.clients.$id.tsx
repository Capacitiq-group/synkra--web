import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getClient, upsertClient, setClientStatus, addClientCredits, listServicesAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";

const clientOpts = (id: string) => queryOptions({
  queryKey: ["admin", "client", id],
  queryFn: () => (id === "new" ? Promise.resolve(null) : getClient({ data: { id } })),
});
const servicesOpts = queryOptions({ queryKey: ["admin", "services-list"], queryFn: () => listServicesAdmin() });

export const Route = createFileRoute("/_admin/admin/dashboard/clients/$id")({
  loader: async ({ params, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(clientOpts(params.id)),
      context.queryClient.ensureQueryData(servicesOpts),
    ]);
  },
  component: ClientDetail,
});

function ClientDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(clientOpts(id));
  const { data: services } = useSuspenseQuery(servicesOpts);
  const c = data?.client;
  const isNew = id === "new";

  const [form, setForm] = useState({
    company_name: c?.company_name ?? "",
    contact_name: c?.contact_name ?? "",
    email: c?.email ?? "",
    phone: c?.phone ?? "",
    service_slug: c?.service_slug ?? "",
    plan_tier: (c?.plan_tier ?? "") as any,
    monthly_credit_allowance: c?.monthly_credit_allowance ?? 0,
    notes: c?.notes ?? "",
    testimonial: (c as any)?.testimonial ?? "",
    testimonial_published: (c as any)?.testimonial_published ?? false,
    logo_url: (c as any)?.logo_url ?? "",
  });

  const upsertFn = useServerFn(upsertClient);
  const statusFn = useServerFn(setClientStatus);
  const creditsFn = useServerFn(addClientCredits);

  const save = useMutation({
    mutationFn: () => upsertFn({ data: {
      ...(isNew ? {} : { id }),
      company_name: form.company_name,
      contact_name: form.contact_name || null,
      email: form.email || "",
      phone: form.phone || null,
      service_slug: form.service_slug || null,
      plan_tier: (form.plan_tier || null) as any,
      monthly_credit_allowance: Number(form.monthly_credit_allowance) || 0,
      notes: form.notes || null,
      testimonial: form.testimonial || null,
      testimonial_published: !!form.testimonial_published,
      logo_url: form.logo_url || null,
    } }),
    onSuccess: (row: any) => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
      if (isNew && row?.id) nav({ to: "/admin/dashboard/clients/$id" as any, params: { id: row.id } as any });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setStatus = useMutation({
    mutationFn: (status: any) => statusFn({ data: { id, status } }),
    onSuccess: () => { toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["admin", "client", id] }); qc.invalidateQueries({ queryKey: ["admin", "clients"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const [credit, setCredit] = useState({ amount: 0, description: "", txn_type: "grant" as any });
  const addCredits = useMutation({
    mutationFn: () => creditsFn({ data: { id, amount: Number(credit.amount), description: credit.description, txn_type: credit.txn_type } }),
    onSuccess: () => { toast.success("Credits updated"); setCredit({ amount: 0, description: "", txn_type: "grant" }); qc.invalidateQueries({ queryKey: ["admin", "client", id] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div><Link to={"/admin/dashboard/clients" as any} className="text-sm text-[color:var(--color-admin-text-muted)] hover:text-[color:var(--color-admin-accent)]">← Back to clients</Link></div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card">
          <div className="text-lg font-semibold mb-4">{isNew ? "New client" : c?.company_name}</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["company_name","Company"],["contact_name","Contact"],["email","Email"],["phone","Phone"],
            ].map(([k,l]) => (
              <div key={k}><label className="admin-label">{l}</label><input className="admin-input" value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div>
              <label className="admin-label">Service</label>
              <select className="admin-input" value={form.service_slug} onChange={(e) => setForm({ ...form, service_slug: e.target.value })}>
                <option value="">—</option>
                {services.map((s: any) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Plan tier</label>
              <select className="admin-input" value={form.plan_tier ?? ""} onChange={(e) => setForm({ ...form, plan_tier: e.target.value })}>
                <option value="">—</option><option>basic</option><option>standard</option><option>premium</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Monthly credit allowance</label>
              <input type="number" className="admin-input" value={form.monthly_credit_allowance} onChange={(e) => setForm({ ...form, monthly_credit_allowance: Number(e.target.value) })} />
            </div>
          </div>
          <div className="mt-4">
            <label className="admin-label">Notes</label>
            <textarea className="admin-input min-h-24" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="admin-btn-primary" onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</button>
          </div>
        </div>

        {!isNew && c && (
          <div className="space-y-4">
            <div className="admin-card">
              <div className="admin-label">Status</div>
              <div className="text-2xl font-semibold capitalize">{c.status}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.status !== "active" && <button className="admin-btn-secondary" onClick={() => setStatus.mutate("active")}>Activate</button>}
                {c.status === "active" && <button className="admin-btn-secondary" onClick={() => setStatus.mutate("paused")}>Pause</button>}
                {c.status !== "cancelled" && <button className="admin-btn-danger" onClick={() => { if (confirm("Cancel service?")) setStatus.mutate("cancelled"); }}>Cancel</button>}
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-label">Credit balance</div>
              <div className="text-2xl font-semibold">{c.credit_balance}</div>
              <div className="mt-4 space-y-2">
                <input type="number" placeholder="Amount (+/-)" className="admin-input" value={credit.amount} onChange={(e) => setCredit({ ...credit, amount: Number(e.target.value) })} />
                <input placeholder="Description" className="admin-input" value={credit.description} onChange={(e) => setCredit({ ...credit, description: e.target.value })} />
                <select className="admin-input" value={credit.txn_type} onChange={(e) => setCredit({ ...credit, txn_type: e.target.value as any })}>
                  <option value="grant">Grant</option><option value="adjustment">Adjustment</option><option value="overage_recovery">Overage recovery</option>
                </select>
                <button className="admin-btn-primary w-full" disabled={!credit.amount || !credit.description || addCredits.isPending} onClick={() => addCredits.mutate()}>Apply</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isNew && data?.transactions && (
        <div className="admin-card">
          <div className="text-lg font-semibold mb-4">Credit transactions</div>
          <table className="admin-table">
            <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
              <tr><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Amount</th><th className="py-2 pr-4">Description</th><th className="py-2">Balance</th></tr>
            </thead>
            <tbody>
              {data.transactions.map((t: any) => (
                <tr key={t.id} className="border-t border-[color:var(--color-admin-border)]">
                  <td className="py-2 pr-4">{new Date(t.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4">{t.txn_type}</td>
                  <td className="py-2 pr-4" style={{ color: t.amount >= 0 ? "#56d722" : "#ef4444" }}>{t.amount >= 0 ? "+" : ""}{t.amount}</td>
                  <td className="py-2 pr-4">{t.description}</td>
                  <td className="py-2">{t.balance_after}</td>
                </tr>
              ))}
              {data.transactions.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[color:var(--color-admin-text-muted)]">No transactions.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
