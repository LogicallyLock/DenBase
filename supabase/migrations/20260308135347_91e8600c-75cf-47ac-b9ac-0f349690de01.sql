
-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  category text,
  tags text[] DEFAULT '{}',
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'draft',
  featured boolean DEFAULT false,
  author_id uuid NOT NULL,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Careers table
CREATE TABLE public.careers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  location text,
  job_type text NOT NULL DEFAULT 'full-time',
  department text,
  requirements text,
  benefits text,
  salary_range text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Career applications table
CREATE TABLE public.career_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  career_id uuid NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  resume_url text,
  cover_letter text,
  status text NOT NULL DEFAULT 'pending',
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Published blog posts viewable by everyone" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Careers policies
CREATE POLICY "Open careers viewable by everyone" ON public.careers
  FOR SELECT USING (status = 'open' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert careers" ON public.careers
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update careers" ON public.careers
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete careers" ON public.careers
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Career applications policies
CREATE POLICY "Authenticated users can apply" ON public.career_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON public.career_applications
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications" ON public.career_applications
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications" ON public.career_applications
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON public.careers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
