import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildHead } from "@/lib/seo";
import {
  helpCategories,
  helpCenterQuestions,
} from "@/data/helpCenterData";

export const Route = createFileRoute("/help")({
  head: () =>
    buildHead({
      title: "Help Centre, Synkra Technologies",
      description:
        "Answers to every common question about Synkra Technologies' services, pricing, credits, onboarding, and how everything works.",
      path: "/help",
    }),
  component: HelpPage,
});

function HelpPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof helpCategories)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return helpCenterQuestions.filter((item) => {
      const catMatch = category === "All" || item.category === category;
      const qMatch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [query, category]);

  return (
    <div className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">HELP CENTRE</p>
        <h1 className="heading-display mt-6 max-w-[800px]">
          Answers to the questions you probably have right now.
        </h1>
        <p className="body-text mt-8 max-w-[600px]">
          If your question is not answered here, contact us directly and we
          will respond within 24 hours on business days.
        </p>

        <div className="mt-10 relative max-w-full lg:max-w-[480px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a question"
            className="w-full rounded-md border border-white/10 bg-[#0a0a0a] pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-brand-green)] focus:outline-none"
          />
        </div>

        <div className="hairline mt-12" />

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {helpCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`pb-1 text-sm font-medium transition-colors cursor-pointer border-b-2 ${
                category === cat
                  ? "text-white border-[var(--color-brand-green)]"
                  : "text-white/50 border-transparent hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {filtered.length === 0 ? (
            <p className="body-text">
              No questions match your search. Try a different keyword or
              category.
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filtered.map((item, idx) => (
                <AccordionItem
                  key={`${item.question}-${idx}`}
                  value={`item-${idx}`}
                  className="border-b border-white/10"
                >
                  <AccordionTrigger className="py-6 hover:no-underline">
                    <div className="text-left pr-6">
                      <p className="label-tag text-[var(--color-brand-green)]">
                        {item.category}
                      </p>
                      <p className="heading-card mt-2">{item.question}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-sm text-white/70 max-w-[720px] leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <div className="hairline mt-16" />

        <div className="mt-16">
          <h2 className="heading-section max-w-[560px]">
            Still have a question we have not answered here.
          </h2>
          <p className="body-text mt-6 max-w-[480px]">
            Reach out directly and we will get back to you within 24 hours on
            business days.
          </p>
          <Link to="/contact" className="btn-primary mt-8">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
