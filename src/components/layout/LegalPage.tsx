import { type ReactNode } from "react";

export type LegalSection = { heading: string; body: ReactNode };

export default function LegalPage({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <p className="label-tag">LEGAL</p>
        <h1 className="heading-section mt-4 max-w-[700px]">{title}</h1>
        <p className="mt-4 text-sm text-white/40">
          Last updated {lastUpdated}
        </p>

        <div className="hairline mt-10" />

        <div className="mt-12 space-y-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="heading-card">{s.heading}</h2>
              <div className="mt-4 max-w-[720px] text-sm leading-relaxed text-white/70 space-y-4">
                {typeof s.body === "string" ? <p>{s.body}</p> : s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
