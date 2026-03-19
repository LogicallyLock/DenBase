import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Clock, Coins, Send, CheckCircle2 } from "lucide-react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-accent/10 text-accent",
  intermediate: "bg-primary/10 text-primary",
  advanced: "bg-destructive/10 text-destructive",
};

const Challenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitForm, setSubmitForm] = useState({ submission_url: "", notes: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [chalRes, subRes] = await Promise.all([
        supabase.from("challenges").select("*").eq("status", "active").order("created_at", { ascending: false }),
        user ? supabase.from("challenge_submissions").select("*").eq("user_id", user.id) : Promise.resolve({ data: [] }),
      ]);
      if (chalRes.data) setChallenges(chalRes.data);
      if (subRes.data) {
        const map: Record<string, any> = {};
        (subRes.data as any[]).forEach((s: any) => { map[s.challenge_id] = s; });
        setMySubmissions(map);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSubmit = async (challengeId: string) => {
    if (!user) return;
    const { error } = await supabase.from("challenge_submissions").insert({
      challenge_id: challengeId,
      user_id: user.id,
      submission_url: submitForm.submission_url || null,
      notes: submitForm.notes || null,
    });
    if (error) { toast.error(error.code === "23505" ? "Already submitted" : error.message); return; }
    toast.success("Submission sent! Awaiting review.");
    setSubmitting(null);
    setSubmitForm({ submission_url: "", notes: "" });
    // Refresh submissions
    const { data } = await supabase.from("challenge_submissions").select("*").eq("user_id", user.id);
    if (data) {
      const map: Record<string, any> = {};
      data.forEach((s: any) => { map[s.challenge_id] = s; });
      setMySubmissions(map);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold mb-2">Skill Challenges</h1>
          <p className="text-muted-foreground mb-8">Complete challenges to earn SkillCredits and climb the leaderboard.</p>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : challenges.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No active challenges right now. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((c) => {
                const submission = mySubmissions[c.id];
                const isSubmitting = submitting === c.id;
                return (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold">{c.title}</h3>
                        {c.skill_category && <span className="text-xs text-muted-foreground">{c.skill_category}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[c.difficulty] || "bg-secondary text-secondary-foreground"}`}>
                          {c.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-accent">
                          <Coins className="w-3.5 h-3.5" /> +{c.credit_reward}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                    {c.deadline && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                        <Clock className="w-3.5 h-3.5" /> Deadline: {new Date(c.deadline).toLocaleDateString()}
                      </div>
                    )}

                    {submission ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
                        <CheckCircle2 className={`w-4 h-4 ${submission.status === "approved" ? "text-accent" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium capitalize">{submission.status === "approved" ? "Approved ✓" : submission.status}</span>
                      </div>
                    ) : isSubmitting ? (
                      <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
                        <div className="space-y-2">
                          <Label>Solution Link</Label>
                          <Input value={submitForm.submission_url} onChange={(e) => setSubmitForm({ ...submitForm, submission_url: e.target.value })} placeholder="https://github.com/..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea value={submitForm.notes} onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })} placeholder="Describe your approach..." rows={2} />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="hero" size="sm" onClick={() => handleSubmit(c.id)}><Send className="w-3.5 h-3.5 mr-1" /> Submit</Button>
                          <Button variant="outline" size="sm" onClick={() => setSubmitting(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="default" size="sm" onClick={() => setSubmitting(c.id)}>Submit Solution</Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Challenges;
