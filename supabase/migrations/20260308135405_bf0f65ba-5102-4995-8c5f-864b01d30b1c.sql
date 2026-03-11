
-- Fix: require authenticated user for career applications
DROP POLICY "Authenticated users can apply" ON public.career_applications;
CREATE POLICY "Authenticated users can apply" ON public.career_applications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
