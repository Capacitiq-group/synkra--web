
-- ROLES
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins read admin_users" ON public.admin_users;
CREATE POLICY "Admins read admin_users" ON public.admin_users FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write admin_users" ON public.admin_users;
CREATE POLICY "Admins write admin_users" ON public.admin_users FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS admin_users_updated_at ON public.admin_users;
CREATE TRIGGER admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  setup_fee INTEGER NOT NULL DEFAULT 0,
  monthly_basic INTEGER,
  monthly_standard INTEGER,
  monthly_premium INTEGER,
  usage_rate NUMERIC,
  usage_unit TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active services" ON public.services;
CREATE POLICY "Public read active services" ON public.services FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write services" ON public.services;
CREATE POLICY "Admins write services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (slug, name, setup_fee, monthly_basic, monthly_standard, monthly_premium, usage_rate, usage_unit, sort_order) VALUES
  ('ai-voice-agents','AI Voice Agents',4500,700,1200,2500,1.80,'per minute',1),
  ('ai-chatbots','AI Chatbots',3500,700,1200,2500,0.30,'per message',2),
  ('ai-content-creation','AI Content Creation',2500,700,1200,2500,15.00,'per article',3),
  ('ai-image-generation','AI Image Generation',2000,700,1200,2500,5.00,'per image',4),
  ('ai-video-generation','AI Video Generation',5000,700,1200,2500,25.00,'per video',5),
  ('ai-workflow-automation','AI Workflow Automation',6000,700,1200,2500,NULL,NULL,6),
  ('ai-data-analysis','AI Data Analysis',4000,700,1200,2500,NULL,NULL,7),
  ('virtual-photoshoot','Virtual Photoshoot',3500,700,1200,2500,20.00,'per photo',8)
ON CONFLICT (slug) DO NOTHING;

-- PORTFOLIO
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_name TEXT,
  category TEXT,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  outcome TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  aspect_ratio TEXT DEFAULT '16/9',
  disclaimer TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published portfolio" ON public.portfolio_items;
CREATE POLICY "Public read published portfolio" ON public.portfolio_items FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write portfolio" ON public.portfolio_items;
CREATE POLICY "Admins write portfolio" ON public.portfolio_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS portfolio_items_updated_at ON public.portfolio_items;
CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BLOG
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_md TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  author_name TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read published blog" ON public.blog_posts;
CREATE POLICY "Public read published blog" ON public.blog_posts FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write blog" ON public.blog_posts;
CREATE POLICY "Admins write blog" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  service_slug TEXT REFERENCES public.services(slug),
  plan_tier TEXT CHECK (plan_tier IN ('basic','standard','premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','cancelled')),
  credit_balance INTEGER NOT NULL DEFAULT 0,
  monthly_credit_allowance INTEGER NOT NULL DEFAULT 0,
  onboarding_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CREDIT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  txn_type TEXT NOT NULL CHECK (txn_type IN ('grant','usage','adjustment','overage_recovery')),
  amount INTEGER NOT NULL,
  description TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage credit_transactions" ON public.credit_transactions;
CREATE POLICY "Admins manage credit_transactions" ON public.credit_transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX IF NOT EXISTS credit_transactions_client_created_idx ON public.credit_transactions (client_id, created_at DESC);

-- APPROVED PARTNERS
CREATE TABLE IF NOT EXISTS public.approved_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.form_submissions(id) ON DELETE SET NULL,
  partner_type TEXT NOT NULL CHECK (partner_type IN ('agency','referral')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  commission_rate NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','terminated')),
  notes TEXT,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.approved_partners TO authenticated;
GRANT ALL ON public.approved_partners TO service_role;
ALTER TABLE public.approved_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage approved_partners" ON public.approved_partners;
CREATE POLICY "Admins manage approved_partners" ON public.approved_partners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS approved_partners_updated_at ON public.approved_partners;
CREATE TRIGGER approved_partners_updated_at BEFORE UPDATE ON public.approved_partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FORM_SUBMISSIONS: add status + admin read/update
ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived','converted'));

GRANT SELECT, UPDATE ON public.form_submissions TO authenticated;

DROP POLICY IF EXISTS "Admins read submissions" ON public.form_submissions;
CREATE POLICY "Admins read submissions" ON public.form_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update submissions" ON public.form_submissions;
CREATE POLICY "Admins update submissions" ON public.form_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
