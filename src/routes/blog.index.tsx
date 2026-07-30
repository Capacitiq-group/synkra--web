import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { buildHead } from "@/lib/seo";
import { listBlogPosts, type BlogListItem } from "@/lib/public.functions";

export const Route = createFileRoute("/blog/")({
  head: () =>
    buildHead({
      title: "Blog",
      description:
        "Practical writing on AI automation for South African businesses — what works, what it costs, and how to put it into your operation.",
      path: "/blog",
    }),
  loader: async () => ({ posts: await listBlogPosts() }),
  component: BlogIndex,
});

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BlogIndex() {
  const { posts } = Route.useLoaderData() as { posts: BlogListItem[] };
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(
    () =>
      category === "All"
        ? posts
        : posts.filter((p) => p.category === category),
    [posts, category],
  );

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const popular = [...posts]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);

  return (
    <div className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">Blog</p>
        <h1 className="heading-display mt-6 max-w-[900px]">
          Writing on AI automation that is actually useful to run a business
          with.
        </h1>
        <p className="body-text mt-8 max-w-[600px]">
          No hype, no theory. What we build, what it costs, and what it changes
          for the businesses running it.
        </p>

        {posts.length === 0 ? (
          <>
            <div className="hairline mt-12" />
            <p className="body-text mt-10 max-w-[560px]">
              The first articles are being written now. Check back shortly, or
              get in touch if there is something specific you would like us to
              cover.
            </p>
            <Link to="/contact" className="btn-primary mt-8">
              Contact Us
            </Link>
          </>
        ) : (
          <>
            <div className="hairline mt-12" />

            {categories.length > 1 && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`cursor-pointer border-b-2 pb-1 text-sm font-medium transition-colors ${
                      category === c
                        ? "border-[var(--color-brand-green)] text-white"
                        : "border-transparent text-white/50 hover:text-white/80"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                {featured && <FeaturedCard post={featured} />}

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {rest.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4">
                <p className="label-tag">Most read</p>
                <ul className="mt-6 space-y-6">
                  {popular.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        className="group block"
                      >
                        <p className="text-sm font-medium text-white transition-colors group-hover:text-[var(--color-brand-green)]">
                          {p.title}
                        </p>
                        <p className="label-tag mt-2 text-white/40">
                          {p.read_time_minutes} min read
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="hairline mt-10" />
                <p className="body-sm mt-8 text-white/60">
                  Want a system like the ones we write about running in your
                  business?
                </p>
                <Link to="/contact" className="btn-primary mt-6">
                  Get Started
                </Link>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogListItem }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f]"
    >
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="p-8">
        <p className="label-tag text-[var(--color-brand-green)]">
          {post.category ?? "Featured"}
        </p>
        <h2 className="heading-card mt-4">{post.title}</h2>
        {post.excerpt && <p className="body-text mt-4">{post.excerpt}</p>}
        <p className="label-tag mt-6 text-white/40">
          {formatDate(post.published_at)} · {post.read_time_minutes} min read
        </p>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogListItem }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] transition-colors hover:border-white/15"
    >
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="label-tag text-[var(--color-brand-green)]">
          {post.category ?? "Article"}
        </p>
        <h3 className="heading-card mt-3 text-lg">{post.title}</h3>
        {post.excerpt && <p className="body-sm mt-3 text-white/60">{post.excerpt}</p>}
        <p className="label-tag mt-auto pt-6 text-white/40">
          {formatDate(post.published_at)} · {post.read_time_minutes} min read
        </p>
      </div>
    </Link>
  );
}
