export type PortfolioItem = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  servicePage: string;
  description: string;
  fullDescription: string;
  images: string[];
  imageFit?: "cover" | "contain";
  status: "concept" | "client";
  featured?: boolean;
  disclaimer?: string;
};

export const PORTFOLIO_CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "AI Voice Agent", slug: "ai-voice-agent" },
  { label: "AI WhatsApp Agent", slug: "ai-whatsapp-agent" },
  { label: "Web Widget", slug: "ai-web-widget" },
  { label: "Speed to Lead", slug: "speed-to-lead" },
  { label: "Lead Reactivation", slug: "lead-reactivation" },
  { label: "AI Knowledge Base", slug: "ai-knowledge-base" },
] as const;

export const portfolioItems: PortfolioItem[] = [];
