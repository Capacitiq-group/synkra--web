import { createServerFn } from "@tanstack/react-start";
import PocketBase from "pocketbase";
import { z } from "zod";

function publicClient(): PocketBase {
  const url = process.env["POCKETBASE_URL"] ?? process.env["VITE_POCKETBASE_URL"];
  if (!url) throw new Error("Missing POCKETBASE_URL environment variable.");
  const pb = new PocketBase(url.replace(/\/+$/, ""));
  pb.autoCancellation(false);
  return pb;
}

export const listPublicTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const pb = publicClient();
  try {
    const records = await pb.collection("clients").getFullList({
      filter: pb.filter("testimonial_published = true && testimonial != ''"),
      fields: "id,company_name,contact_name,testimonial,logo_url",
      sort: "-created",
      limit: 12,
    });
    return records;
  } catch {
    return [];
  }
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
    const pb = publicClient();
    try {
      const records = await pb.collection("blog_posts").getFullList({
        filter: pb.filter("status = 'published'"),
        sort: "-published_at",
        limit: 60,
      });
      return records.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt ?? null,
        cover_image_url: r.cover_image_url ?? null,
        author_name: r.author_name ?? null,
        category: r.category ?? null,
        tags: Array.isArray(r.tags) ? r.tags : [],
        featured: !!r.featured,
        view_count: r.view_count ?? 0,
        read_time_minutes: r.read_time_minutes ?? 5,
        published_at: r.published_at ?? null,
      }));
    } catch {
      return [];
    }
  },
);

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const pb = publicClient();
    try {
      const post: any = await pb
        .collection("blog_posts")
        .getFirstListItem(pb.filter("slug = {:slug} && status = 'published'", { slug: data.slug }));
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? null,
        content_md: post.content_md,
        cover_image_url: post.cover_image_url ?? null,
        author_name: post.author_name ?? null,
        category: post.category ?? null,
        tags: Array.isArray(post.tags) ? post.tags : [],
        featured: !!post.featured,
        view_count: post.view_count ?? 0,
        read_time_minutes: post.read_time_minutes ?? 5,
        published_at: post.published_at ?? null,
      };
    } catch {
      return null;
    }
  });

// PocketBase has no server-side RPC layer, so the atomic increment_blog_view
// SQL function becomes a read-then-write. Small race-condition risk under
// concurrent views on the same post — acceptable for a view counter, not
// worth a distributed lock for this.
export const incrementBlogView = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const pb = publicClient();
    try {
      const post: any = await pb
        .collection("blog_posts")
        .getFirstListItem(pb.filter("slug = {:slug} && status = 'published'", { slug: data.slug }));
      await pb.collection("blog_posts").update(post.id, { view_count: (post.view_count ?? 0) + 1 });
    } catch {
      // Never fail the page load because of a view-count miss.
    }
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
    const pb = publicClient();
    try {
      await pb.collection("waitlist").create({ email: data.email, product: data.product });
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not join the waitlist right now." };
    }
  });
