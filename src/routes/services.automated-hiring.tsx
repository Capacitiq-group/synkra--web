import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { SERVICES } from "@/data/services";

const data = SERVICES["automated-hiring"];

export const Route = createFileRoute("/services/automated-hiring")({
  head: () =>
    buildHead({
      title: "Automated Hiring System",
      description: data.short,
      path: "/services/automated-hiring",
    }),
  component: () => <ServiceDetail data={data} />,
});
