-- Drop FK constraints on matches that reference auth.users (demo users aren't in auth.users)
ALTER TABLE public.matches DROP CONSTRAINT matches_user_a_fkey;
ALTER TABLE public.matches DROP CONSTRAINT matches_user_b_fkey;

-- Update session_type check to include video, peer_exchange, group
ALTER TABLE public.sessions DROP CONSTRAINT sessions_session_type_check;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_session_type_check 
  CHECK (session_type = ANY (ARRAY['exchange'::text, 'paid'::text, 'video'::text, 'peer_exchange'::text, 'group'::text]));