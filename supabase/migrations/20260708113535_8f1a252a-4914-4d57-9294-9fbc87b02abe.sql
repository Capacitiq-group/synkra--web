CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit log" ON public.admin_audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert audit log" ON public.admin_audit_log FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);

-- Add optional testimonial text on clients (public testimonials feature)
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS testimonial text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS testimonial_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS logo_url text;

-- Allow anon to read published testimonials (narrow projection enforced in code)
CREATE POLICY "Public can read published testimonials" ON public.clients FOR SELECT TO anon USING (testimonial_published = true);
GRANT SELECT ON public.clients TO anon;