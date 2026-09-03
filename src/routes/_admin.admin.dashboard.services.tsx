import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listServicesAdmin, upsertService } from "@/lib/admin.functions";
import { toast } from "sonner";
import { useState } from "react";

const opts = queryOptions({ queryKey: ["admin", "services"], queryFn: () => listServicesAdmin() });

export const Route = createFileRoute("/_admin/admin/dashboard/services")({
  loader: ({ context }) => context.queryClient.ensureQueryData(opts),
  component: ServicesPage,
});

function Row({ svc, onSave }: { svc: any; onSave: (v: any) => void }) {
  const [f, setF] = useState({
    setup_fee: svc.setup_fee, monthly_basic: svc.monthly_basic ?? 0,
    monthly_standard: svc.monthly_standard ?? 0, monthly_premium: svc.monthly_premium ?? 0,
    usage_rate: svc.usage_rate ?? 0, usage_unit: svc.usage_unit ?? "", active: svc.active,
  });
  return (
    <tr className="border-t border-[color:var(--color-admin-border)]">
      <td className="py-2 pr-4 font-medium">{svc.name}<div className="text-xs text-[color:var(--color-admin-text-muted)]">{svc.slug}</div></td>
      {(["setup_fee","monthly_basic","monthly_standard","monthly_premium","usage_rate"] as const).map((k) => (
        <td key={k} className="py-2 pr-2"><input type="number" className="admin-input max-w-24" value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: Number(e.target.value) })} /></td>
      ))}
      <td className="py-2 pr-2"><input className="admin-input max-w-32" value={f.usage_unit} onChange={(e) => setF({ ...f, usage_unit: e.target.value })} /></td>
      <td className="py-2 pr-2"><input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /></td>
      <td className="py-2"><button className="admin-btn-primary text-xs" onClick={() => onSave({ id: svc.id, ...f })}>Save</button></td>
    </tr>
  );
}

function ServicesPage() {
  const { data } = useSuspenseQuery(opts);
  const qc = useQueryClient();
  const fn = useServerFn(upsertService);
  const save = useMutation({
    mutationFn: (v: any) => fn({ data: v }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin", "services"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <div className="space-y-4">
      <div
        className="admin-card p-4 text-sm"
        style={{ borderLeft: "4px solid var(--color-admin-warning)", background: "color-mix(in srgb, var(--color-admin-warning) 8%, transparent)" }}
      >
        <p className="font-medium" style={{ color: "var(--color-admin-warning)" }}>
          Not connected to the live site
        </p>
        <p className="mt-1 text-[color:var(--color-admin-text-muted)]">
          The pricing visitors actually see comes from src/data/serviceContent.ts and
          pricingTiers.ts in the codebase, not this table. Saving a change here updates this
          record only - it will not change anything on synkra.co.za.
        </p>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead className="text-left text-xs uppercase tracking-wider text-[color:var(--color-admin-text-muted)]">
            <tr>
              <th className="py-2 pr-4">Service</th><th className="py-2 pr-2">Setup</th>
              <th className="py-2 pr-2">Basic</th><th className="py-2 pr-2">Std</th><th className="py-2 pr-2">Premium</th>
              <th className="py-2 pr-2">Rate</th><th className="py-2 pr-2">Unit</th><th className="py-2 pr-2">Active</th><th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((svc: any) => <Row key={svc.id} svc={svc} onSave={(v) => save.mutate(v)} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
