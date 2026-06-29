import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["speed-to-lead"];

export const Route = createFileRoute("/services/speed-to-lead")({
  head: () =>
    buildHead({
      title: "Speed to Lead System",
      description: data.short,
      path: "/services/speed-to-lead",
    }),
  component: () => <ServiceDetail data={data} />,
});
