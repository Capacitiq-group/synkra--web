import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["ai-whatsapp-agent"];

export const Route = createFileRoute("/services/ai-whatsapp-agent")({
  head: () =>
    buildHead({
      title: "AI WhatsApp Agent",
      description: data.short,
      path: "/services/ai-whatsapp-agent",
    }),
  component: () => <ServiceDetail data={data} />,
});
