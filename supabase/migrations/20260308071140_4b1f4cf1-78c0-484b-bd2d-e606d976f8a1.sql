
-- Drop FKs to allow demo data
ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_id_fkey;
ALTER TABLE public.user_skills DROP CONSTRAINT user_skills_user_id_fkey;

-- Insert 5 demo profiles
INSERT INTO public.profiles (user_id, full_name, bio, experience_level, availability, is_tutor, tutor_category, session_price, avg_rating, total_sessions) VALUES
('11111111-1111-1111-1111-111111111111', 'Alex Rivera', 'Full-stack developer with 8 years of experience. Passionate about teaching React and TypeScript.', 'expert', 'Weekday evenings', true, 'Programming', 45, 4.9, 127),
('22222222-2222-2222-2222-222222222222', 'Maya Chen', 'UX designer and Figma enthusiast. Love exchanging design skills for music lessons!', 'advanced', 'Weekends', false, null, null, 4.7, 53),
('33333333-3333-3333-3333-333333333333', 'James Okonkwo', 'Professional guitarist and music producer. Available for peer exchanges and paid sessions.', 'expert', 'Flexible', true, 'Music', 35, 4.8, 89),
('44444444-4444-4444-4444-444444444444', 'Sofia Martinez', 'Native Spanish speaker and certified language tutor. Also learning Japanese and Python.', 'advanced', 'Mornings & evenings', true, 'Languages', 30, 4.9, 214),
('55555555-5555-5555-5555-555555555555', 'Liam Park', 'Photographer and video editor. Swapping creative skills with developers and designers.', 'intermediate', 'Weekends & evenings', false, null, null, 4.5, 31);

-- Insert demo user skills
INSERT INTO public.user_skills (user_id, skill_id, skill_type) VALUES
('11111111-1111-1111-1111-111111111111', '48c599ba-1962-43ec-a182-8ec7ad59875e', 'teach'),
('11111111-1111-1111-1111-111111111111', 'af36fbd3-4133-4e97-89a7-203ddd802319', 'teach'),
('11111111-1111-1111-1111-111111111111', '6f93cf26-2e45-4fc5-bea7-344d1f142028', 'learn'),
('11111111-1111-1111-1111-111111111111', '19b6c1a1-a9bf-4250-8e2e-ebcbca9776d9', 'learn'),
('22222222-2222-2222-2222-222222222222', '4b15009e-46e1-4c3c-b5fc-887971f5fdd7', 'teach'),
('22222222-2222-2222-2222-222222222222', 'ef1ccaae-f5df-4a1b-8add-7d2d261b93a6', 'teach'),
('22222222-2222-2222-2222-222222222222', '74d9e024-19cb-43a2-8fe4-ecd0f5f0cd64', 'learn'),
('22222222-2222-2222-2222-222222222222', 'c69efd24-1d79-4ca4-b38e-17bd4f0a910c', 'learn'),
('33333333-3333-3333-3333-333333333333', '74d9e024-19cb-43a2-8fe4-ecd0f5f0cd64', 'teach'),
('33333333-3333-3333-3333-333333333333', '688dd1b3-559a-4115-891a-35a92aa53dba', 'teach'),
('33333333-3333-3333-3333-333333333333', 'bfebfc51-1f52-4118-a864-09118ff48952', 'learn'),
('33333333-3333-3333-3333-333333333333', '25c44943-1005-4a14-82d5-358193607681', 'learn'),
('44444444-4444-4444-4444-444444444444', '6f93cf26-2e45-4fc5-bea7-344d1f142028', 'teach'),
('44444444-4444-4444-4444-444444444444', 'bb03c19e-21f3-46ad-9e10-1b87e5e89f5c', 'teach'),
('44444444-4444-4444-4444-444444444444', 'e379e5ca-a6af-4c62-bc55-e6d5b931dd0b', 'learn'),
('44444444-4444-4444-4444-444444444444', '65b364b2-eac5-4aa4-ac2a-8a9e1c6a7a4e', 'learn'),
('55555555-5555-5555-5555-555555555555', '19b6c1a1-a9bf-4250-8e2e-ebcbca9776d9', 'teach'),
('55555555-5555-5555-5555-555555555555', '9e7bafc6-310b-4b83-94ec-dc627df4b646', 'teach'),
('55555555-5555-5555-5555-555555555555', '48c599ba-1962-43ec-a182-8ec7ad59875e', 'learn'),
('55555555-5555-5555-5555-555555555555', '2dbee981-85cf-46cb-b658-8959fcfafac2', 'learn');

-- Re-add FKs as NOT VALID (won't check existing rows)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.user_skills ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
