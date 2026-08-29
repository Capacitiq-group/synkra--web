import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { buildHead } from "@/lib/seo";
import { getBlogPost, incrementBlogView } from "@/lib/public.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    let post: Awaited<ReturnType<typeof getBlogPost>> | null = null;
    try {
      post = await getBlogPost({ data: { slug: params.slug } });
    } catch (error) {
      console.error("[blog] failed to load post", error);
    }
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article unavailable | Synkra" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const base = buildHead({
      title: loaderData.post.title,
      description:
        loaderData.post.excerpt ??
        "An article from the Synkra blog on AI automation for South African businesses.",
      path: `/blog/${loaderData.post.slug}`,
      ogType: "article",
    });
    return base;
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderMarkdown(md: string) {
  const blocks = md.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="heading-card mt-10">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="heading-section mt-14">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="heading-section mt-14">
          {trimmed.slice(2)}
        </h2>
      );
    }
    if (/^([-*]|\d+\.)\s/.test(trimmed)) {
      const items = trimmed.split("\n").map((l) => l.replace(/^([-*]|\d+\.)\s/, ""));
      return (
        <ul key={i} className="mt-6 space-y-3">
          {items.map((it, j) => (
            <li key={j} className="flex gap-3 text-base leading-relaxed text-white/70">
              <span className="text-[var(--color-brand-green)]">—</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className="mt-8 border-l-2 border-[var(--color-brand-green)] pl-6 text-lg leading-relaxed text-white/80"
        >
          {trimmed.replace(/^>\s?/gm, "")}
        </blockquote>
      );
    }
    return (
      <p key={i} className="mt-6 text-base leading-relaxed text-white/70">
        {trimmed}
      </p>
    );
  });
}

function BlogPost() {
  const { post } = Route.useLoaderData();

  useEffect(() => {
    void incrementBlogView({ data: { slug: post.slug } }).catch(() => {});
  }, [post.slug]);

  return (
    <div className="bg-[#0a0a0a]">
      <article className="container-main section-padding">
        <Link to="/blog" className="arrow-link">
          <span className="arrow">←</span> Back to blog
        </Link>

        <p className="label-tag mt-10 text-[var(--color-brand-green)]">
          {post.category ?? "Article"}
        </p>
        <h1 className="heading-display mt-6 max-w-[900px]">{post.title}</h1>
        <p className="label-tag mt-8 text-white/40">
          {post.author_name ? `${post.author_name} · ` : ""}
          {formatDate(post.published_at)} · {post.read_time_minutes} min read
        </p>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}

        <div className="hairline mt-12" />

        <div className="mt-4 max-w-[760px]">{renderMarkdown(post.content_md)}</div>

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-3">
            {(post.tags as string[]).map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-white/50"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="hairline mt-16" />

        <div className="mt-16 max-w-[560px]">
          <h2 className="heading-section">
            Want this running inside your business.
          </h2>
          <p className="body-text mt-6">
            Book a discovery call and we will tell you exactly which system pays
            back fastest for your operation.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary justify-center">
              Get Started
            </Link>
            <Link to="/services" className="btn-secondary justify-center">
              See all services
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function PostNotFound() {
  return (
    <div className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">404</p>
        <h1 className="heading-display mt-6 max-w-[720px]">
          That article does not exist or is no longer published.
        </h1>
        <Link to="/blog" className="btn-primary mt-10">
          Back to the blog
        </Link>
      </div>
    </div>
  );
}
