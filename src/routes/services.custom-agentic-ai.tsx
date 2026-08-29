import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["custom-agentic-ai"];

export const Route = createFileRoute("/services/custom-agentic-ai")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/custom-agentic-ai",
    }),
  component: () => <ServicePageLayout data={data} />,
});
