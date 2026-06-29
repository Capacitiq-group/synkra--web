import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["ai-web-widget"];

export const Route = createFileRoute("/services/ai-web-widget")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/ai-web-widget",
    }),
  component: () => <ServicePageLayout data={data} />,
});
