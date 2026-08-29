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
  company_name: z.string().trim().min(1).max(200),
  contact_name: z.string().trim().max(200).optional().nullable(),
  contact_email: z.string().trim().max(200).optional().nullable(),
  contact_phone: z.string().trim().max(50).optional().nullable(),
  status: z.string().trim().max(50).optional(),
  plan: z.string().trim().max(50).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
  logo_url: z.string().trim().max(1000).optional().nullable(),
  testimonial: z.string().trim().max(2000).optional().nullable(),
  testimonial_published: z.boolean().optional(),
});

export const PortfolioInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().max(100).optional().nullable(),
  summary: z.string().trim().max(2000).optional().nullable(),
  body_md: z.string().max(50000).optional().nullable(),
  images: z.array(z.string().max(1000)).optional(),
  status: z.string().trim().max(50).optional(),
  sort_order: z.number().int().optional(),
});

export const BlogInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(2000).optional().nullable(),
  content_md: z.string().max(200000).optional().nullable(),
  cover_image_url: z.string().trim().max(1000).optional().nullable(),
  author_name: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().max(100).optional().nullable(),
  tags: z.array(z.string().max(80)).optional(),
  featured: z.boolean().optional(),
  read_time_minutes: z.number().int().min(1).max(120).optional(),
  status: z.string().trim().max(50).optional(),
  published_at: z.string().optional().nullable(),
});
