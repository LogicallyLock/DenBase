import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, UserCheck, UserX, Percent } from "lucide-react";

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch existing matches
      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

      // Fetch user's skills
      const { data: mySkills } = await supabase.from("user_skills").select("skill_id, skill_type").eq("user_id", user.id);
      const teachIds = mySkills?.filter((s) => s.skill_type === "teach").map((s) => s.skill_id) || [];
      const learnIds = mySkills?.filter((s) => s.skill_type === "learn").map((s) => s.skill_id) || [];

      // Find users who teach what I want to learn
      if (learnIds.length > 0) {
        const { data: potentialMatches } = await supabase
          .from("user_skills")
          .select("user_id, skill_id, skills(name)")
          .in("skill_id", learnIds)
          .eq("skill_type", "teach")
          .neq("user_id", user.id)
          .limit(20);

        if (potentialMatches) {
          const uniqueUsers = [...new Set(potentialMatches.map((p) => p.user_id))];
          const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", uniqueUsers);
          const existing = new Set((matchData || []).flatMap((m: any) => [m.user_a, m.user_b]));

          const suggestionsWithProfiles = uniqueUsers
            .filter((uid) => !existing.has(uid))
            .map((uid) => {
              const profile = profiles?.find((p) => p.user_id === uid);
              const matchingSkills = potentialMatches.filter((p) => p.user_id === uid);
              const score = Math.min(100, Math.round((matchingSkills.length / Math.max(learnIds.length, 1)) * 100));
              return { user_id: uid, profile, matchingSkills, score };
            })
            .sort((a, b) => b.score - a.score);

          setSuggestions(suggestionsWithProfiles);
        }
      }

      // Enrich existing matches with profiles
      if (matchData) {
        const otherIds = matchData.map((m: any) => (m.user_a === user.id ? m.user_b : m.user_a));
        const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", otherIds);
        setMatches(matchData.map((m: any) => ({
          ...m,
          other_profile: profiles?.find((p) => p.user_id === (m.user_a === user.id ? m.user_b : m.user_a)),
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const sendMatchRequest = async (targetUserId: string) => {
    if (!user) return;
    const { error } = await supabase.from("matches").insert({
      user_a: user.id, user_b: targetUserId, status: "pending",
      compatibility_score: suggestions.find((s) => s.user_id === targetUserId)?.score || 0,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Match request sent!");
      setSuggestions((prev) => prev.filter((s) => s.user_id !== targetUserId));
    }
  };

  const updateMatch = async (matchId: string, status: string) => {
    const { error } = await supabase.from("matches").update({ status }).eq("id", matchId);
    if (error) toast.error(error.message);
    else {
      toast.success(status === "accepted" ? "Match accepted!" : "Match declined");
      setMatches((prev) => prev.map((m) => m.id === matchId ? { ...m, status } : m));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center gap-4">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-lg font-bold">Skill Matches</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Suggestions */}
          <h2 className="text-xl font-bold mb-4">Suggested Matches</h2>
          {suggestions.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center mb-10">
              <p className="text-muted-foreground text-sm">Add skills you want to learn to see match suggestions.</p>
              <Link to="/profile"><Button variant="outline" size="sm" className="mt-3">Update Skills</Button></Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {suggestions.slice(0, 6).map((s) => (
                <div key={s.user_id} className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {(s.profile?.full_name || "?")[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{s.profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.profile?.bio || "No bio"}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <Percent className="w-3 h-3" />{s.score}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.matchingSkills.slice(0, 3).map((sk: any) => (
                      <span key={sk.skill_id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-medium">
                        {sk.skills?.name}
                      </span>
                    ))}
                  </div>
                  <Button variant="hero" size="sm" className="w-full" onClick={() => sendMatchRequest(s.user_id)}>
                    Send Match Request
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Existing matches */}
          <h2 className="text-xl font-bold mb-4">Your Matches</h2>
          {matches.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground text-sm">No matches yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between shadow-elevated">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {(m.other_profile?.full_name || "?")[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{m.other_profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{m.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {m.status === "pending" && m.user_b === user?.id && (
                      <>
                        <Button variant="hero" size="sm" onClick={() => updateMatch(m.id, "accepted")}>
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => updateMatch(m.id, "declined")}>
                          <UserX className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {m.status === "accepted" && (
                      <Link to="/messages"><Button variant="outline" size="sm">Message</Button></Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Matches;
