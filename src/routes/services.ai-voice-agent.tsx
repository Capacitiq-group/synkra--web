import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["ai-voice-agent"];

export const Route = createFileRoute("/services/ai-voice-agent")({
  head: () =>
    buildHead({
      title: "AI Voice Agent",
      description: data.short,
      path: "/services/ai-voice-agent",
    }),
  component: () => <ServiceDetail data={data} />,
});
