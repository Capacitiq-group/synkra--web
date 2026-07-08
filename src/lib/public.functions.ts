import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const listPublicTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase
    .from("clients")
    .select("id, company_name, contact_name, testimonial, logo_url")
    .eq("testimonial_published", true)
    .not("testimonial", "is", null)
    .limit(12);
  if (error) return [];
  return (data ?? []).filter((r) => r.testimonial && r.testimonial.trim().length > 0);
});
