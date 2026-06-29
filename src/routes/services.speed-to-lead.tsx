import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ServicePageLayout from "@/components/layout/ServicePageLayout";
import { SERVICE_CONTENT } from "@/data/serviceContent";

const data = SERVICE_CONTENT["speed-to-lead"];

export const Route = createFileRoute("/services/speed-to-lead")({
  head: () =>
    buildHead({
      title: data.serviceLabel,
      description: data.subtitle,
      path: "/services/speed-to-lead",
    }),
  component: () => <ServicePageLayout data={data} />,
});
