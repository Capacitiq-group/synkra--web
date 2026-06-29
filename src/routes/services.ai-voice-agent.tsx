import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["ai-voice-agent"];

export const Route = createFileRoute("/services/ai-voice-agent")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/ai-voice-agent",
    }),
  component: () => <ServicePageLayout data={data} />,
});
