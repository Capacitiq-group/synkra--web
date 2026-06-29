import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["ai-knowledge-base"];

export const Route = createFileRoute("/services/ai-knowledge-base")({
  head: () =>
    buildHead({
      title: "AI Knowledge Base",
      description: data.short,
      path: "/services/ai-knowledge-base",
    }),
  component: () => <ServiceDetail data={data} />,
});
