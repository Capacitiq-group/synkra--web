import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---- helpers ----
async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden: admin only");
}

async function audit(
  ctx: { supabase: any; userId: string; claims: any },
  action: string,
  entity_type: string | null,
  entity_id: string | null,
  metadata: Record<string, any> = {},
) {
  try {
    await ctx.supabase.from("admin_audit_log").insert({
      actor_id: ctx.userId,
      actor_email: ctx.claims?.email ?? null,
      action,
      entity_type,
      entity_id,
      metadata,
    });
  } catch {
    // Never fail the request because of audit
  }
}

// ================= OVERVIEW =================
export const overviewStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const [clients, portfolio, blog, subs] = await Promise.all([
      s.from("clients").select("id, status, credit_balance"),
      s.from("portfolio_items").select("id, status"),
      s.from("blog_posts").select("id, status"),
      s.from("form_submissions").select("id, status, form_type, created_at").order("created_at", { ascending: false }).limit(200),
    ]);
    const activeClients = clients.data?.filter((c: any) => c.status === "active").length ?? 0;
    const totalCredits = clients.data?.reduce((n: number, c: any) => n + (c.credit_balance ?? 0), 0) ?? 0;
    const newSubs = subs.data?.filter((s: any) => s.status === "new").length ?? 0;
    // build 30-day timeseries
    const byDay: Record<string, number> = {};
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      byDay[d] = 0;
    }
    subs.data?.forEach((r: any) => {
      const k = r.created_at.slice(0, 10);
      if (k in byDay) byDay[k]++;
    });
    return {
      clientsTotal: clients.data?.length ?? 0,
      clientsActive: activeClients,
      portfolioTotal: portfolio.data?.length ?? 0,
      portfolioPublished: portfolio.data?.filter((p: any) => p.status === "published").length ?? 0,
      blogTotal: blog.data?.length ?? 0,
      blogPublished: blog.data?.filter((b: any) => b.status === "published").length ?? 0,
      submissionsNew: newSubs,
      totalCredits,
      submissionsTimeseries: Object.entries(byDay).map(([date, count]) => ({ date, count })),
      recentSubmissions: subs.data?.slice(0, 10) ?? [],
    };
  });

// ================= CLIENTS =================
export const listClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("clients").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const [client, txns] = await Promise.all([
      s.from("clients").select("*").eq("id", data.id).maybeSingle(),
      s.from("credit_transactions").select("*").eq("client_id", data.id).order("created_at", { ascending: false }).limit(50),
    ]);
    if (client.error) throw client.error;
    if (!client.data) throw new Error("Not found");
    return { client: client.data, transactions: txns.data ?? [] };
  });

const ClientInput = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1),
  contact_name: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().nullable(),
  service_slug: z.string().optional().nullable(),
  plan_tier: z.enum(["basic", "standard", "premium"]).optional().nullable(),
  monthly_credit_allowance: z.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
});
export const upsertClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ClientInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const payload = { ...data, email: data.email || null };
    if (data.id) {
      const { data: row, error } = await s.from("clients").update(payload).eq("id", data.id).select().single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await s.from("clients").insert(payload).select().single();
    if (error) throw error;
    return row;
  });

export const setClientStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["active", "paused", "cancelled"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("clients").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    await audit(context, "client.status_change", "client", data.id, { status: data.status });
    return { ok: true };
  });

export const addClientCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      amount: z.number().int(),
      description: z.string().min(1),
      txn_type: z.enum(["grant", "adjustment", "overage_recovery"]).default("grant"),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const { data: client, error: e1 } = await s.from("clients").select("credit_balance").eq("id", data.id).single();
    if (e1) throw e1;
    const newBalance = (client.credit_balance ?? 0) + data.amount;
    const { error: e2 } = await s.from("clients").update({ credit_balance: newBalance }).eq("id", data.id);
    if (e2) throw e2;
    const { error: e3 } = await s.from("credit_transactions").insert({
      client_id: data.id,
      txn_type: data.txn_type,
      amount: data.amount,
      description: data.description,
      balance_after: newBalance,
    });
    if (e3) throw e3;
    return { balance: newBalance };
  });

// ================= PORTFOLIO =================
export const listPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("portfolio_items").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.id === "new") return null;
    const { data: row, error } = await context.supabase.from("portfolio_items").select("*").eq("id", data.id).maybeSingle();
    if (error) throw error;
    return row;
  });

const PortfolioInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  client_name: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  aspect_ratio: z.string().optional().nullable(),
  disclaimer: z.string().optional().nullable(),
  services: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.number().int().default(0),
});
export const upsertPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PortfolioInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const payload: any = { ...data };
    if (data.status === "published") payload.published_at = new Date().toISOString();
    if (data.id) {
      const { data: row, error } = await s.from("portfolio_items").update(payload).eq("id", data.id).select().single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await s.from("portfolio_items").insert(payload).select().single();
    if (error) throw error;
    return row;
  });

export const deletePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("portfolio_items").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ================= BLOG =================
export const listBlog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.id === "new") return null;
    const { data: row, error } = await context.supabase.from("blog_posts").select("*").eq("id", data.id).maybeSingle();
    if (error) throw error;
    return row;
  });

const BlogInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content_md: z.string().default(""),
  cover_image_url: z.string().optional().nullable(),
  author_name: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});
export const upsertBlog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BlogInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const payload: any = { ...data };
    if (data.status === "published") payload.published_at = new Date().toISOString();
    if (data.id) {
      const { data: row, error } = await s.from("blog_posts").update(payload).eq("id", data.id).select().single();
      if (error) throw error;
      return row;
    }
    const { data: row, error } = await s.from("blog_posts").insert(payload).select().single();
    if (error) throw error;
    return row;
  });

export const deleteBlog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ================= SUBMISSIONS =================
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("form_submissions").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw error;
    return data ?? [];
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "read", "archived", "converted"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("form_submissions").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ================= PARTNERS =================
export const listPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [approved, applications] = await Promise.all([
      context.supabase.from("approved_partners").select("*").order("created_at", { ascending: false }),
      context.supabase.from("form_submissions").select("*")
        .in("form_type", ["partner_agency", "partner_referral"])
        .order("created_at", { ascending: false }),
    ]);
    if (approved.error) throw approved.error;
    if (applications.error) throw applications.error;
    return { approved: approved.data ?? [], applications: applications.data ?? [] };
  });

export const approvePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      partner_type: z.enum(["agency", "referral"]),
      name: z.string().min(1),
      email: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      company: z.string().optional().nullable(),
      commission_rate: z.number().min(0).max(100).default(0),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const s = context.supabase;
    const { error } = await s.from("approved_partners").insert(data);
    if (error) throw error;
    await s.from("form_submissions").update({ status: "converted" }).eq("id", data.submission_id);
    return { ok: true };
  });

export const updatePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      commission_rate: z.number().min(0).max(100).optional(),
      status: z.enum(["active", "paused", "terminated"]).optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("approved_partners").update(rest).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

// ================= SERVICES =================
export const listServicesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("services").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  });

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      setup_fee: z.number().int().min(0),
      monthly_basic: z.number().int().nullable(),
      monthly_standard: z.number().int().nullable(),
      monthly_premium: z.number().int().nullable(),
      usage_rate: z.number().nullable(),
      usage_unit: z.string().nullable(),
      active: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("services").update(rest).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

// ================= ADMIN USERS =================
export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const inviteAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email(), full_name: z.string().optional() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Try invite; if user exists, promote directly.
    let userId: string | null = null;
    const inv = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
    if (inv.data?.user) userId = inv.data.user.id;
    else {
      // fallback: find by listing (best effort)
      const list = await supabaseAdmin.auth.admin.listUsers();
      const u = list.data?.users.find((x) => x.email === data.email);
      if (u) userId = u.id;
    }
    if (!userId) throw new Error("Could not create or find user. SMTP may not be configured.");
    await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    await supabaseAdmin.from("admin_users").upsert({ id: userId, email: data.email, full_name: data.full_name ?? null });
    return { ok: true, userId };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) throw new Error("Cannot remove yourself");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    await supabaseAdmin.from("admin_users").delete().eq("id", data.userId);
    return { ok: true };
  });

// Self-check for admin (used by client-side gate)
export const meIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    // Also upsert admin_users profile for convenience
    if (data) {
      await context.supabase.from("admin_users").upsert(
        { id: context.userId, email: context.claims.email ?? "", last_sign_in_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    }
    return { isAdmin: !!data, userId: context.userId, email: context.claims.email ?? null };
  });
