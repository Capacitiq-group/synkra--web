import { useQuery } from "@tanstack/react-query";
import { listPublicTestimonials } from "@/lib/public.functions";

export default function Testimonials() {
  const { data } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: () => listPublicTestimonials(),
    staleTime: 5 * 60 * 1000,
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="container-main">
        <div className="mb-12 text-center">
          <p className="label-tag">Client stories</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white lg:text-5xl">
            What our clients say
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => (
            <figure
              key={t.id}
              className="rounded-2xl border border-white/5 bg-[#151519] p-6 lg:p-7"
            >
              <blockquote className="text-sm leading-relaxed text-white/80">
                "{t.testimonial}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.logo_url ? (
                  <img
                    src={t.logo_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">
                    {t.company_name?.charAt(0) ?? "•"}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.company_name}
                  </div>
                  {t.contact_name && (
                    <div className="text-xs text-white/50">{t.contact_name}</div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
