
-- Companies table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  description text DEFAULT '',
  website text,
  user_id uuid NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Users can create own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any company" ON public.companies FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete companies" ON public.companies FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Job listings table
CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  requirements text,
  location text,
  job_type text NOT NULL DEFAULT 'full-time',
  salary_range text,
  skills_required text[] DEFAULT '{}',
  screening_criteria jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open jobs viewable by everyone" ON public.job_listings FOR SELECT USING (status = 'open' OR EXISTS (SELECT 1 FROM companies WHERE companies.id = job_listings.company_id AND companies.user_id = auth.uid()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Company owners can insert jobs" ON public.job_listings FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM companies WHERE companies.id = job_listings.company_id AND companies.user_id = auth.uid()));
CREATE POLICY "Company owners can update jobs" ON public.job_listings FOR UPDATE USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = job_listings.company_id AND companies.user_id = auth.uid()));
CREATE POLICY "Admins can update any job" ON public.job_listings FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Company owners can delete jobs" ON public.job_listings FOR DELETE USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = job_listings.company_id AND companies.user_id = auth.uid()));
CREATE POLICY "Admins can delete any job" ON public.job_listings FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Job applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  cover_letter text,
  resume_url text,
  screening_score integer,
  screening_summary text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Company owners can view applications" ON public.job_applications FOR SELECT USING (EXISTS (SELECT 1 FROM job_listings jl JOIN companies c ON c.id = jl.company_id WHERE jl.id = job_applications.job_id AND c.user_id = auth.uid()));
CREATE POLICY "Admins can view all applications" ON public.job_applications FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can apply" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update applications" ON public.job_applications FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Company owners can update applications" ON public.job_applications FOR UPDATE USING (EXISTS (SELECT 1 FROM job_listings jl JOIN companies c ON c.id = jl.company_id WHERE jl.id = job_applications.job_id AND c.user_id = auth.uid()));
CREATE POLICY "Admins can delete applications" ON public.job_applications FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on job_listings
CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON public.job_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
