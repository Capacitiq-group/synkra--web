import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["ai-knowledge-base"];

export const Route = createFileRoute("/services/ai-knowledge-base")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/ai-knowledge-base",
    }),
  component: () => <ServicePageLayout data={data} />,
});
