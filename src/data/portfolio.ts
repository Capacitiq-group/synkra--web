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
  { label: "Virtual Photoshoot", slug: "virtual-photoshoot" },
  { label: "AI Voice Agent", slug: "ai-voice-agent" },
  { label: "AI WhatsApp Agent", slug: "ai-whatsapp-agent" },
  { label: "Web Widget", slug: "ai-web-widget" },
  { label: "Speed to Lead", slug: "speed-to-lead" },
  { label: "Lead Reactivation", slug: "lead-reactivation" },
  { label: "AI Knowledge Base", slug: "ai-knowledge-base" },
  { label: "Automated Hiring", slug: "automated-hiring" },
] as const;

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "skoon-virtual-photoshoot-concept",
    title: "SKOON. Virtual Photoshoot Concept",
    category: "Virtual Photoshoot",
    categorySlug: "virtual-photoshoot",
    servicePage: "/services/virtual-photoshoot",
    description:
      "A concept demonstrating what AI-generated product photography looks like at campaign quality for a real South African skincare brand. Every image below was generated without a photographer, studio, or model booking.",
    fullDescription:
      "SKOON. is a South African skincare brand with a clean, minimal aesthetic and a strong existing visual identity. This concept was created to demonstrate how Virtual Photoshoot can match and extend that identity — producing campaign-ready images across lifestyle, product, and editorial styles without any physical shoot. The images below were generated using the brand packaging, a defined character, and scene direction. No prompts were used for several of these images. The AI understood the brand well enough to generate on-brand results independently.",
    images: [
      "https://res.cloudinary.com/dewvhnks3/image/upload/v1782763795/image_gn8lfn.webp",
      "https://res.cloudinary.com/dewvhnks3/image/upload/v1782763795/image_3_mer80w.jpg",
      "https://res.cloudinary.com/dewvhnks3/image/upload/v1782763795/image_2_w3xg2x.jpg",
      "https://res.cloudinary.com/dewvhnks3/image/upload/v1782763796/image_quihyd.jpg",
      "https://res.cloudinary.com/dewvhnks3/image/upload/v1782763796/image_1_nxfrio.jpg",
    ],
    imageFit: "contain",
    status: "concept",
    featured: true,
    disclaimer:
      "This is a concept project. It is not endorsed by, sponsored by, or affiliated with SKOON. Skincare. All brand marks remain the property of their respective owners.",
  },
];
