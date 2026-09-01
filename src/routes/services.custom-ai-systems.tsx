import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["custom-ai-systems"];

export const Route = createFileRoute("/services/custom-ai-systems")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/custom-ai-systems",
    }),
  component: () => <ServicePageLayout data={data} />,
});
