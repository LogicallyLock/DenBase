Project-wide constraints and design decisions for the SkillSwap platform.

## Project Memory

### Admin Panel
- User's email: shashank (user_id: eca765d4-d5d4-4c26-a53a-e6c78e401a84) is the first admin
- Admin roles stored in `user_roles` table with `app_role` enum (admin, moderator, user)
- `has_role()` security definer function used for RLS to avoid recursion
- FK constraints dropped from matches (user_a, user_b), sessions (host_id, participant_id), ratings (rater_id, rated_id) to support demo users
- Admin sidebar includes: Overview, Users, Matches, Sessions, Skills, Roles, Blog, Careers, Challenges

### Design
- Uses semantic tokens from index.css/tailwind.config.ts
- Card style: rounded-2xl, border-border, bg-card
- Font: extrabold for headings

### Payments
- Razorpay integration in Test Mode (edge functions: razorpay-create-order, razorpay-verify-payment)
- Credits + Buy credits model: users can purchase credits with Razorpay

### SkillCredits System
- New users get 50 credits on signup (default in profiles.credits_balance)
- Teaching 1hr = +10 credits, Challenge = +20, Referral = +10, Project join = +5
- credit_transactions table tracks all credit movements
- profiles.credits_balance stores current balance
- Session booking deducts credits from participant
- Session completion awards credits to host/teacher
- Session cancellation refunds credits to participant

### Referral System
- profiles.referral_code (unique, 8-char hex) auto-generated on signup via handle_new_user()
- profiles.referred_by stores referrer's user_id
- Referral link: /auth?ref={code} - auto-switches to signup mode
- On signup with referral, referrer gets +10 credits (referral_bonus)

### New Tables Added
- credit_transactions: user_id, amount, type, description, reference_id
- projects: title, description, skills_required[], max_collaborators, duration, status, creator_id, github_repo
- project_members: project_id, user_id, role, contributions
- challenges: title, description, skill_category, difficulty, credit_reward, deadline, status, created_by
- challenge_submissions: challenge_id, user_id, submission_url, notes, status

### Profile Updates
- Portfolio links: github_url, linkedin_url, website_url added to profiles
- sessions_attended column added to profiles
- credits_balance column added to profiles
- referral_code, referred_by columns added to profiles

### Routes
- /credits, /projects, /challenges, /leaderboard (all protected)
- /admin/challenges (admin only)
