const STATS = [
  { value: "< 90s", label: "Average time to first contact on a new lead" },
  { value: "24/7", label: "Availability across calls, chat, and WhatsApp" },
  { value: "R700", label: "Entry monthly retainer, all hosting included" },
  { value: "14 days", label: "From payment to a system running live" },
];

export default function Stats() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main">
        <div className="hairline" />
        <div className="section-padding-sm grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="label-tag">By The Numbers</p>
            <h2 className="heading-section mt-6 max-w-[380px]">
              What working with us actually looks like.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="display-sm">{s.value}</p>
                  <p className="body-sm mt-3 max-w-[280px] text-white/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hairline" />
      </div>
    </section>
  );
}
