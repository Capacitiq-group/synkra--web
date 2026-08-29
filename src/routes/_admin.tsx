import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { pb } from "@/integrations/pocketbase/client";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async () => {
    // A valid authStore token already means MFA (if enabled on the
    // collection) was satisfied — PocketBase never issues a usable token
    // for an MFA-enabled collection until both factors succeed. No
    // separate role check needed: every admin_users record is an admin.
    if (!pb.authStore.isValid || !pb.authStore.record) {
      throw redirect({ to: "/admin/login" });
    }
    try {
      await pb.collection("admin_users").authRefresh();
    } catch {
      pb.authStore.clear();
      throw redirect({ to: "/admin/login" });
    }
    return { userId: pb.authStore.record.id, email: pb.authStore.record["email"] as string };
  },
  component: () => <Outlet />,
});
