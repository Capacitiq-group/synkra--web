import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminAuth } from "@/integrations/pocketbase/auth-middleware";

// No assertAdmin() helper needed: requireAdminAuth already proves the
// caller has a valid admin_users record, and every admin_users record is
// an admin by definition (see POCKETBASE-MIGRATION-PLAN.md).

async function audit(
  ctx: { pb: any; userId: string; email: string },
  action: string,
  entity_type: string | null,
  entity_id: string | null,
  metadata: Record<string, any> = {},
) {
  try {
    await ctx.pb.collection("admin_audit_log").create({
      actor_id: ctx.userId,
      actor_email: ctx.email ?? null,
      action,
      entity_type,
      entity_id,
      metadata,
    });
  } catch {
    // Never fail the request because of audit
  }
}

const idSchema = z.string().min(1);

// ================= OVERVIEW =================
export const overviewStats = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    const pb = context.pb;
    const [clients, portfolio, blog, subs] = await Promise.all([
      pb.collection("clients").getFullList({ fields: "id,status,credit_balance" }),
      pb.collection("portfolio_items").getFullList({ fields: "id,status" }),
      pb.collection("blog_posts").getFullList({ fields: "id,status" }),
      pb.collection("form_submissions").getFullList({
        fields: "id,status,form_type,created",
        sort: "-created",
        limit: 200,
      }),
    ]);
    const activeClients = clients.filter((c: any) => c.status === "active").length;
    const totalCredits = clients.reduce((n: number, c: any) => n + (c.credit_balance ?? 0), 0);
    const newSubs = subs.filter((s: any) => s.status === "new").length;

    const byDay: Record<string, number> = {};
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      byDay[d] = 0;
    }
    subs.forEach((r: any) => {
      const k = String(r.created).slice(0, 10);
      if (k in byDay) byDay[k]++;
    });

    return {
      clientsTotal: clients.length,
      clientsActive: activeClients,
      portfolioTotal: portfolio.length,
      portfolioPublished: portfolio.filter((p: any) => p.status === "published").length,
      blogTotal: blog.length,
      blogPublished: blog.filter((b: any) => b.status === "published").length,
      submissionsNew: newSubs,
      totalCredits,
      submissionsTimeseries: Object.entries(byDay).map(([date, count]) => ({ date, count })),
      recentSubmissions: subs.slice(0, 10),
    };
  });

// ================= CLIENTS =================
export const listClients = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("clients").getFullList({ sort: "-created" });
  });

export const getClient = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .inputValidator((d: { id: string }) => z.object({ id: idSchema }).parse(d))
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    let client;
    try {
      client = await pb.collection("clients").getOne(data.id);
    } catch {
      throw new Error("Not found");
    }
    const transactions = await pb.collection("credit_transactions").getFullList({
      filter: pb.filter("client_id = {:id}", { id: data.id }),
      sort: "-created",
      limit: 50,
    });
    return { client, transactions };
  });

const ClientInput = z.object({
  id: idSchema.optional(),
  company_name: z.string().min(1),
  contact_name: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().nullable(),
  service_slug: z.string().optional().nullable(),
  plan_tier: z.enum(["basic", "standard", "premium"]).optional().nullable(),
  monthly_credit_allowance: z.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
  testimonial: z.string().optional().nullable(),
  testimonial_published: z.boolean().optional(),
  logo_url: z.string().optional().nullable(),
});
export const upsertClient = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => ClientInput.parse(d))
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    const { id, ...rest } = data;
    const payload = { ...rest, email: rest.email || null };
    if (id) return pb.collection("clients").update(id, payload);
    return pb.collection("clients").create(payload);
  });

export const setClientStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: idSchema, status: z.enum(["active", "paused", "cancelled"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await context.pb.collection("clients").update(data.id, { status: data.status });
    await audit(context, "client.status_change", "client", data.id, { status: data.status });
    return { ok: true };
  });

export const addClientCredits = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: idSchema,
        amount: z.number().int(),
        description: z.string().min(1),
        txn_type: z.enum(["grant", "adjustment", "overage_recovery"]).default("grant"),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    const client: any = await pb.collection("clients").getOne(data.id, { fields: "credit_balance" });
    const newBalance = (client.credit_balance ?? 0) + data.amount;
    await pb.collection("clients").update(data.id, { credit_balance: newBalance });
    await pb.collection("credit_transactions").create({
      client_id: data.id,
      txn_type: data.txn_type,
      amount: data.amount,
      description: data.description,
      balance_after: newBalance,
    });
    await audit(context, "client.credits_grant", "client", data.id, {
      amount: data.amount,
      txn_type: data.txn_type,
      balance_after: newBalance,
    });
    return { balance: newBalance };
  });

// ================= PORTFOLIO =================
export const listPortfolio = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("portfolio_items").getFullList({ sort: "sort_order,-created" });
  });

export const getPortfolio = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    if (data.id === "new") return null;
    try {
      return await context.pb.collection("portfolio_items").getOne(data.id);
    } catch {
      return null;
    }
  });

const PortfolioInput = z.object({
  id: idSchema.optional(),
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
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => PortfolioInput.parse(d))
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    const { id, ...rest } = data;
    const payload: any = { ...rest };
    if (data.status === "published") payload.published_at = new Date().toISOString();
    if (id) return pb.collection("portfolio_items").update(id, payload);
    return pb.collection("portfolio_items").create(payload);
  });

export const deletePortfolio = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => z.object({ id: idSchema }).parse(d))
  .handler(async ({ context, data }) => {
    await context.pb.collection("portfolio_items").delete(data.id);
    return { ok: true };
  });

// ================= BLOG =================
export const listBlog = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("blog_posts").getFullList({ sort: "-created" });
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    if (data.id === "new") return null;
    try {
      return await context.pb.collection("blog_posts").getOne(data.id);
    } catch {
      return null;
    }
  });

const BlogInput = z.object({
  id: idSchema.optional(),
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
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => BlogInput.parse(d))
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    const { id, ...rest } = data;
    const payload: any = { ...rest };
    if (data.status === "published") payload.published_at = new Date().toISOString();
    if (id) return pb.collection("blog_posts").update(id, payload);
    return pb.collection("blog_posts").create(payload);
  });

export const deleteBlog = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => z.object({ id: idSchema }).parse(d))
  .handler(async ({ context, data }) => {
    await context.pb.collection("blog_posts").delete(data.id);
    return { ok: true };
  });

// ================= SUBMISSIONS =================
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("form_submissions").getFullList({ sort: "-created", limit: 500 });
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: idSchema, status: z.enum(["new", "read", "archived", "converted"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await context.pb.collection("form_submissions").update(data.id, { status: data.status });
    await audit(context, "submission.status_change", "form_submission", data.id, { status: data.status });
    return { ok: true };
  });

// ================= PARTNERS =================
export const listPartners = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    const pb = context.pb;
    const [approved, applications] = await Promise.all([
      pb.collection("approved_partners").getFullList({ sort: "-created" }),
      pb.collection("form_submissions").getFullList({
        filter: pb.filter("form_type = 'partner_agency' || form_type = 'partner_referral'"),
        sort: "-created",
      }),
    ]);
    return { approved, applications };
  });

export const approvePartner = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        submission_id: idSchema,
        partner_type: z.enum(["agency", "referral"]),
        name: z.string().min(1),
        email: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        company: z.string().optional().nullable(),
        commission_rate: z.number().min(0).max(100).default(0),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const pb = context.pb;
    await pb.collection("approved_partners").create(data);
    await pb.collection("form_submissions").update(data.submission_id, { status: "converted" });
    await audit(context, "partner.approve", "approved_partner", data.submission_id, {
      partner_type: data.partner_type,
      name: data.name,
      commission_rate: data.commission_rate,
    });
    return { ok: true };
  });

export const updatePartner = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: idSchema,
        commission_rate: z.number().min(0).max(100).optional(),
        status: z.enum(["active", "paused", "terminated"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { id, ...rest } = data;
    await context.pb.collection("approved_partners").update(id, rest);
    await audit(context, "partner.update", "approved_partner", id, rest);
    return { ok: true };
  });

// ================= SERVICES =================
export const listServicesAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("services").getFullList({ sort: "sort_order" });
  });

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: idSchema,
        setup_fee: z.number().int().min(0),
        monthly_basic: z.number().int().nullable(),
        monthly_standard: z.number().int().nullable(),
        monthly_premium: z.number().int().nullable(),
        usage_rate: z.number().nullable(),
        usage_unit: z.string().nullable(),
        active: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { id, ...rest } = data;
    await context.pb.collection("services").update(id, rest);
    return { ok: true };
  });

// ================= ADMIN USERS =================
export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("admin_users").getFullList({ sort: "-created" });
  });

// PocketBase has no "invite by email" auth-admin API like Supabase's
// inviteUserByEmail. Equivalent flow: superuser creates the admin_users
// record with a random throwaway password, then requests a password-reset
// email so the invitee sets their own password via PocketBase's built-in
// reset-link flow.
export const inviteAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: z.string().email(), full_name: z.string().optional() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { getPbAdmin } = await import("@/integrations/pocketbase/client.server");
    const pbAdmin = await getPbAdmin();
    const throwawayPassword = crypto.randomUUID() + crypto.randomUUID();
    const record = await pbAdmin.collection("admin_users").create({
      email: data.email,
      full_name: data.full_name ?? null,
      password: throwawayPassword,
      passwordConfirm: throwawayPassword,
      emailVisibility: true,
      verified: true,
    });
    await pbAdmin.collection("admin_users").requestPasswordReset(data.email);
    await audit(context, "admin.invite", "user", record.id, { email: data.email });
    return { ok: true, userId: record.id };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((d: unknown) => z.object({ userId: idSchema }).parse(d))
  .handler(async ({ context, data }) => {
    if (data.userId === context.userId) throw new Error("Cannot remove yourself");
    const { getPbAdmin } = await import("@/integrations/pocketbase/client.server");
    const pbAdmin = await getPbAdmin();
    await pbAdmin.collection("admin_users").delete(data.userId);
    await audit(context, "admin.remove", "user", data.userId, {});
    return { ok: true };
  });

// ================= AUDIT LOG =================
export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    return context.pb.collection("admin_audit_log").getFullList({ sort: "-created", limit: 500 });
  });

// Self-check for admin (used by client-side gate). Any caller that passed
// requireAdminAuth is, by definition, an admin — this just refreshes
// last_sign_in_at and echoes identity back.
export const meIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async ({ context }) => {
    try {
      await context.pb
        .collection("admin_users")
        .update(context.userId, { last_sign_in_at: new Date().toISOString() });
    } catch {
      // Non-fatal — don't block the admin check on a bookkeeping write.
    }
    return { isAdmin: true, userId: context.userId, email: context.email };
  });
