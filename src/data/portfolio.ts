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
  { label: "Speed to Lead", slug: "speed-to-lead" },
  { label: "Lead Reactivation", slug: "lead-reactivation" },
  { label: "Custom Agentic AI", slug: "custom-agentic-ai" },
] as const;

export const portfolioItems: PortfolioItem[] = [];
