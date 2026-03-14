Project memory: Denbase SkillSwap platform with credit economy, hiring marketplace, and admin panel

### Admin Panel
- User shashank (user_id: eca765d4-d5d4-4c26-a53a-e6c78e401a84) is first admin
- Admin roles in `user_roles` table with `app_role` enum (admin, moderator, user)
- `has_role()` security definer function for RLS
- FK constraints dropped from matches, sessions, ratings for demo users

### Design
- Semantic tokens from index.css/tailwind.config.ts
- Card style: rounded-2xl, border-border, bg-card
- Font: extrabold for headings

### Hiring Marketplace
- `companies` table: company profiles linked to users
- `job_listings` table: jobs posted by companies with `screening_criteria` jsonb
- `job_applications` table: applications with AI screening (score, summary)
- `ai-screen-candidate` edge function: uses Lovable AI (gemini-2.5-flash) to score candidates 0-100
- Routes: /jobs, /jobs/:id, /company (dashboard), /admin/hiring

### Credit Economy
- 50 credits on signup, +10 teaching, +20 challenges, +10 referrals, +5 projects
- Razorpay integration for buying credits

### Payments
- Razorpay keys configured as secrets
