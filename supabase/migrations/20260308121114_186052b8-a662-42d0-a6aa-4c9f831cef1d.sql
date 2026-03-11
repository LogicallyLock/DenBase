-- Drop FK constraints on sessions that reference auth.users (demo users aren't in auth.users)
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_host_id_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_participant_id_fkey;
-- Also drop on ratings
ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_rater_id_fkey;
ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_rated_id_fkey;