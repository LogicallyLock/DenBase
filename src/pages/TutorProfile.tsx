import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Star, DollarSign, Clock, MapPin, BookOpen } from "lucide-react";

const TutorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: prof }, { data: userSkills }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("user_skills").select("*, skills(name, category)").eq("user_id", "").limit(0),
      ]);

      if (prof) {
        setProfile(prof);
        const { data: sk } = await supabase
          .from("user_skills")
          .select("*, skills(name, category)")
          .eq("user_id", prof.user_id);
        setSkills(sk || []);
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Profile not found</div>;

  const teachSkills = skills.filter((s) => s.skill_type === "teach");
  const learnSkills = skills.filter((s) => s.skill_type === "learn");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center gap-4">
          <Link to="/marketplace" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-3xl font-bold text-muted-foreground flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  (profile.full_name || "?")[0]?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.full_name || "Unnamed"}</h1>
                <p className="text-sm text-muted-foreground mt-1">{profile.tutor_category || "General"}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {profile.avg_rating?.toFixed(1) || "New"}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />{profile.session_price || "Free"}/session
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />{profile.total_sessions || 0} sessions
                  </span>
                </div>
              </div>
            </div>
            {profile.bio && (
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-6">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-6">
              {profile.experience_level && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
                  {profile.experience_level}
                </span>
              )}
              {profile.availability && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
                  <Clock className="w-3 h-3" /> {profile.availability}
                </span>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="grid sm:grid-cols-2 gap-6">
            {teachSkills.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                <h2 className="text-sm font-bold mb-4">Can Teach</h2>
                <div className="flex flex-wrap gap-2">
                  {teachSkills.map((s) => (
                    <span key={s.id} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                      {s.skills?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {learnSkills.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                <h2 className="text-sm font-bold mb-4">Wants to Learn</h2>
                <div className="flex flex-wrap gap-2">
                  {learnSkills.map((s) => (
                    <span key={s.id} className="rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium">
                      {s.skills?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TutorProfile;
