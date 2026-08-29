import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import { PRODUCT_CONTENT } from "@/data/productContent";

const data = PRODUCT_CONTENT.chat;

export const Route = createFileRoute("/products/chat")({
  head: () =>
    buildHead({
      title: data.productLabel,
      description: data.subtitle,
      path: "/products/chat",
    }),
  component: () => <ProductPageLayout data={data} />,
});
