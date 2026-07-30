// Centralised SEO helper for Synkra. Every route's `head()` uses this so
// titles, descriptions, canonicals, and Open Graph tags stay consistent.

export const SITE_NAME = "Synkra";
export const SITE_TAGLINE =
  "AI Systems That Run Your Business While You Grow It";
export const SITE_DESCRIPTION =
  "Synkra builds AI automation systems for South African businesses. Voice agents, WhatsApp agents, web widgets, speed-to-lead, lead reactivation, and knowledge bases. From R700 per month.";

// No production domain is connected yet — use relative URLs so they stay
// correct once a custom domain is added. og:image is served from /public.
export const OG_IMAGE = "/og-image.png";

type HeadInput = {
  title: string;
  description: string;
  path: string; // e.g. "/", "/services/ai-voice-agent"
  ogType?: "website" | "article";
};

export function buildHead({
  title,
  description,
  path,
  ogType = "website",
}: HeadInput) {
  const fullTitle =
    path === "/" ? `${SITE_NAME} — ${title}` : `${title} | ${SITE_NAME}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: path },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
