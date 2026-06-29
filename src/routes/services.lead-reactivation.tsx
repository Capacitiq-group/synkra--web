import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["lead-reactivation"];

export const Route = createFileRoute("/services/lead-reactivation")({
  head: () =>
    buildHead({
      title: "Lead Reactivation Campaign",
      description: data.short,
      path: "/services/lead-reactivation",
    }),
  component: () => <ServiceDetail data={data} />,
});
