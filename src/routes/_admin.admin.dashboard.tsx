import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Synkra Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const p = useRouterState({ select: (s) => s.location.pathname });
  const title =
    p === "/admin/dashboard" ? "Overview"
    : p.startsWith("/admin/dashboard/clients") ? "Clients"
    : p.startsWith("/admin/dashboard/portfolio") ? "Portfolio"
    : p.startsWith("/admin/dashboard/blog") ? "Blog"
    : p.startsWith("/admin/dashboard/partners") ? "Partners"
    : p.startsWith("/admin/dashboard/submissions") ? "Submissions"
    : p.startsWith("/admin/dashboard/services") ? "Services"
    : p.startsWith("/admin/dashboard/settings") ? "Settings"
    : "Dashboard";
  return <AdminShell title={title}><Outlet /></AdminShell>;
}
