const STATS = [
  {
    figure: "24/7",
    label: "Always available",
    body: "Agency systems run every hour of every day, including weekends and public holidays, with no overtime or absence.",
  },
  {
    figure: "From R0",
    label: "Every starting price",
    body: "Flow is free to start. Agency starts under R700 a month. Both cost less than a part-time employee.",
  },
  {
    figure: "48 hours",
    label: "Live after onboarding",
    body: "Once your onboarding is complete, most Agency systems go live within 48 hours. Complex builds take longer.",
  },
];

export default function WhySynkra() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="container-main section-padding">
        <div className="max-w-[820px]">
          <p className="label-tag">Why Synkra</p>
          <h2 className="heading-display mt-6">
            Priced for the businesses that need it most, not just the ones
            that can afford enterprise software.
          </h2>
          <p className="body-text mt-8 max-w-[640px]">
            Most companies in this space resell a platform built by someone
            else, with their own name on top. Synkra builds the automation
            itself. That's the reason pricing can work for a business doing
            R500,000 a year, not only one doing R50 million. There's no
            vendor markup sitting between what you pay and what it costs to
            run.
          </p>
        </div>

        <div className="mt-20 border-t border-white/10">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="grid grid-cols-1 gap-6 border-b border-white/10 py-10 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-5">
                <p className="text-5xl font-semibold tracking-tight text-white lg:text-6xl">
                  {s.figure}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="label-tag" style={{ color: "#56d722" }}>
                  {s.label}
                </p>
              </div>
              <div className="md:col-span-5">
                <p className="body-text">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
