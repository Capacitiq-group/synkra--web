import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["ai-web-widget"];

export const Route = createFileRoute("/services/ai-web-widget")({
  head: () =>
    buildHead({
      title: "AI Web Widget Agent",
      description: data.short,
      path: "/services/ai-web-widget",
    }),
  component: () => <ServiceDetail data={data} />,
});
