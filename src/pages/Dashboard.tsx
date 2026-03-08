import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard, MessageSquare, Calendar, User, Search,
  ArrowLeftRight, GraduationCap, Bell, LogOut, ChevronRight,
  Users, Star, TrendingUp, Clock, UserCheck, UserX, Shield
} from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [teachSkills, setTeachSkills] = useState<any[]>([]);
  const [learnSkills, setLearnSkills] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);

  const fetchData = async () => {
    if (!user) return;
    const [profileRes, sessionsRes, matchesRes, skillsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("sessions").select("*").or(`host_id.eq.${user.id},participant_id.eq.${user.id}`).eq("status", "scheduled").order("scheduled_at").limit(5),
      supabase.from("matches").select("*").or(`user_a.eq.${user.id},user_b.eq.${user.id}`).order("created_at", { ascending: false }).limit(10),
      supabase.from("user_skills").select("*, skills(name, category)").eq("user_id", user.id),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (sessionsRes.data) setUpcomingSessions(sessionsRes.data);
    if (matchesRes.data) {
      setMatchCount(matchesRes.data.length);
      // Enrich matches with profiles
      const otherIds = matchesRes.data.map((m: any) => (m.user_a === user.id ? m.user_b : m.user_a));
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", otherIds);
      setRecentMatches(matchesRes.data.map((m: any) => ({
        ...m,
        other_profile: profiles?.find((p: any) => p.user_id === (m.user_a === user.id ? m.user_b : m.user_a)),
      })));
    }
    if (skillsRes.data) {
      setTeachSkills(skillsRes.data.filter((s: any) => s.skill_type === "teach"));
      setLearnSkills(skillsRes.data.filter((s: any) => s.skill_type === "learn"));
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const updateMatch = async (matchId: string, status: string) => {
    const { error } = await supabase.from("matches").update({ status }).eq("id", matchId);
    if (error) toast.error(error.message);
    else {
      toast.success(status === "accepted" ? "Match accepted!" : "Match declined");
      fetchData();
    }
  };

  const cancelSession = async (sessionId: string) => {
    const { error } = await supabase.from("sessions").update({ status: "cancelled" }).eq("id", sessionId);
    if (error) toast.error(error.message);
    else {
      toast.success("Session cancelled");
      fetchData();
    }
  };

  const profileCompletion = profile ? [
    profile.full_name, profile.bio, profile.avatar_url, profile.experience_level, profile.availability,
    teachSkills.length > 0, learnSkills.length > 0,
  ].filter(Boolean).length / 7 * 100 : 0;

  const stats = [
    { icon: Users, label: "Matches", value: matchCount, color: "text-primary" },
    { icon: Calendar, label: "Sessions", value: profile?.total_sessions || 0, color: "text-accent" },
    { icon: Star, label: "Rating", value: profile?.avg_rating?.toFixed(1) || "—", color: "text-primary" },
    { icon: TrendingUp, label: "Skills", value: teachSkills.length + learnSkills.length, color: "text-accent" },
  ];

  const quickLinks = [
    { icon: Search, label: "Find Skills", href: "/marketplace", desc: "Browse tutors & peers" },
    { icon: ArrowLeftRight, label: "Skill Exchange", href: "/matches", desc: "View your matches" },
    { icon: MessageSquare, label: "Messages", href: "/messages", desc: "Chat with partners" },
    { icon: Calendar, label: "Sessions", href: "/sessions", desc: "Upcoming sessions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold">
            <img src="/logo.png" alt="Denbase logo" className="w-7 h-7 rounded-lg object-contain" />
            <span className="text-gradient">Den</span><span>base</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="text-primary"><Shield className="w-4 h-4" /></Button>
              </Link>
            )}
            <Link to="/profile">
              <Button variant="ghost" size="icon"><User className="w-4 h-4" /></Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Welcome back, {profile?.full_name || "there"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's your learning overview.</p>
          </div>

          {/* Profile completion */}
          {profileCompletion < 100 && (
            <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Complete your profile</span>
                <span className="text-xs font-bold text-primary">{Math.round(profileCompletion)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-hero-gradient transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
              </div>
              <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
                Update profile <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="group rounded-2xl border border-border bg-card p-5 hover:shadow-raised hover:border-primary/20 transition-all duration-200"
              >
                <l.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-sm font-bold mb-1">{l.label}</h3>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </Link>
            ))}
          </div>

          {/* Recent Matches */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Matches</h2>
              <Link to="/matches" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            {recentMatches.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No matches yet</p>
                <Link to="/marketplace">
                  <Button variant="outline" size="sm" className="mt-3">Find matches</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMatches.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
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
                          <Button variant="default" size="sm" onClick={() => updateMatch(m.id, "accepted")}>
                            <UserCheck className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => updateMatch(m.id, "declined")}>
                            <UserX className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {m.status === "pending" && m.user_a === user?.id && (
                        <span className="text-xs text-muted-foreground px-2 py-1">Sent</span>
                      )}
                      {m.status === "accepted" && (
                        <Link to="/messages"><Button variant="outline" size="sm">Message</Button></Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming sessions */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Upcoming Sessions</h2>
              <Link to="/sessions" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                <Link to="/marketplace">
                  <Button variant="outline" size="sm" className="mt-3">Find a session</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div>
                      <p className="text-sm font-semibold">{s.title || "Session"}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{s.session_type}</span>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => cancelSession(s.id)}>Cancel</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
