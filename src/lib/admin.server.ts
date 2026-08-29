import { z } from "zod";

export async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error("Role check failed");
  if (!data) throw new Error("Forbidden: admin only");
}

export async function audit(
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

export const ClientInput = z.object({
  id: z.string().uuid().optional(),
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

export const PortfolioInput = z.object({
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

export const BlogInput = z.object({
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
