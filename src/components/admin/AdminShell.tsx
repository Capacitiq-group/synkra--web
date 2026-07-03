import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Users, Briefcase, FileText, Handshake, Inbox, Settings, Wrench, LogOut, Menu, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/dashboard/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/dashboard/clients", label: "Clients", icon: Users },
  { to: "/admin/dashboard/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/admin/dashboard/blog", label: "Blog", icon: FileText },
  { to: "/admin/dashboard/partners", label: "Partners", icon: Handshake },
  { to: "/admin/dashboard/services", label: "Services", icon: Wrench },
  { to: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, title }: { children: ReactNode; title?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const Side = (
    <aside className="w-64 shrink-0 border-r border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface)] flex flex-col">
      <div className="px-6 py-5 border-b border-[color:var(--color-admin-border)]">
        <div className="text-xs font-semibold tracking-widest text-[color:var(--color-admin-text-muted)] uppercase">Synkra</div>
        <div className="text-lg font-semibold text-[color:var(--color-admin-text)]">Admin</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {nav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to as any}
              onClick={() => setOpen(false)}
              className={`mx-3 my-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-[color:var(--color-admin-surface-2)] text-[color:var(--color-admin-accent)]"
                  : "text-[color:var(--color-admin-text)] hover:bg-[color:var(--color-admin-surface-2)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[color:var(--color-admin-border)]">
        <button onClick={signOut} className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[color:var(--color-admin-text-muted)] hover:bg-[color:var(--color-admin-surface-2)]">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-scope flex min-h-screen w-full">
      <div className="hidden lg:block">{Side}</div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative">{Side}</div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-4 lg:px-8 border-b border-[color:var(--color-admin-border)] bg-[color:var(--color-admin-surface)]">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-sm font-semibold text-[color:var(--color-admin-text)]">{title ?? "Dashboard"}</h1>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-full">{children}</main>
      </div>
    </div>
  );
}
