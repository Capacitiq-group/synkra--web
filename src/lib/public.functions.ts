import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicClient } from "./public.server";

export const listPublicTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("clients")
    .select("id, company_name, contact_name, testimonial, logo_url")
    .eq("testimonial_published", true)
    .not("testimonial", "is", null)
    .limit(12);
  if (error) return [];
  return (data ?? []).filter((r) => r.testimonial && r.testimonial.trim().length > 0);
});

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[];
  featured: boolean;
  view_count: number;
  read_time_minutes: number;
  published_at: string | null;
};

export const listBlogPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogListItem[]> => {
    const supabase = publicClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, author_name, category, tags, featured, view_count, read_time_minutes, published_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(60);
    if (error) return [];
    return (data ?? []).map((r) => ({
      ...r,
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    })) as BlogListItem[];
  },
);

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (!supabase) return null;
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !post) return null;
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content_md: post.content_md,
      cover_image_url: post.cover_image_url,
      author_name: post.author_name,
      category: post.category,
      tags: Array.isArray(post.tags) ? (post.tags as string[]) : [],
      featured: post.featured,
      view_count: post.view_count,
      read_time_minutes: post.read_time_minutes,
      published_at: post.published_at,
    };
  });

export const incrementBlogView = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (!supabase) return { ok: true };
    await supabase.rpc("increment_blog_view", { _slug: data.slug });
    return { ok: true };
  });

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(200),
        product: z.string().trim().min(1).max(120),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    if (!supabase) return { ok: false, error: "Could not join the waitlist right now." };
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: data.email, product: data.product });
    if (error) return { ok: false, error: "Could not join the waitlist right now." };
    return { ok: true };
  });
