
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid;

-- Generate referral codes for existing users
UPDATE public.profiles SET referral_code = substr(md5(random()::text), 1, 8) WHERE referral_code IS NULL;

-- Create index for referral lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
