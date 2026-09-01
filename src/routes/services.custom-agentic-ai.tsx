import { createFileRoute, redirect } from "@tanstack/react-router";

// Renamed to /services/custom-ai-systems - "Custom Agentic AI" tested as
// confusing/jargon-y, kept only as a redirect so any existing links,
// bookmarks, or indexed search results still land somewhere real.
export const Route = createFileRoute("/services/custom-agentic-ai")({
  beforeLoad: () => {
    throw redirect({ to: "/services/custom-ai-systems" });
  },
});
