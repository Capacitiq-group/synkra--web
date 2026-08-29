import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import { PRODUCT_CONTENT } from "@/data/productContent";

const data = PRODUCT_CONTENT.flow;

export const Route = createFileRoute("/products/flow")({
  head: () =>
    buildHead({
      title: data.productLabel,
      description: data.subtitle,
      path: "/products/flow",
    }),
  component: () => <ProductPageLayout data={data} />,
});
