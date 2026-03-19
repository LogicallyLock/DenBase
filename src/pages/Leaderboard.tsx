import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, BookOpen, FolderGit2, Medal } from "lucide-react";

type Tab = "mentors" | "learners" | "contributors";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("mentors");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (tab === "mentors") {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, avg_rating, total_sessions, credits_balance")
          .eq("is_tutor", true)
          .order("total_sessions", { ascending: false })
          .limit(20);
        setData(data || []);
      } else if (tab === "learners") {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, sessions_attended, credits_balance")
          .order("sessions_attended", { ascending: false })
          .limit(20);
        setData(data || []);
      } else {
        // Top contributors by credit balance
        const { data } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url, credits_balance")
          .order("credits_balance", { ascending: false })
          .limit(20);
        setData(data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [tab]);

  const tabs = [
    { key: "mentors" as Tab, label: "Top Mentors", icon: Star },
    { key: "learners" as Tab, label: "Top Learners", icon: BookOpen },
    { key: "contributors" as Tab, label: "Top Contributors", icon: FolderGit2 },
  ];

  const getMedalColor = (i: number) => {
    if (i === 0) return "text-yellow-500";
    if (i === 1) return "text-muted-foreground";
    if (i === 2) return "text-orange-600";
    return "text-transparent";
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

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-extrabold">Leaderboard</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : data.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No data yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((item: any, i: number) => (
                <div key={item.user_id} className={`flex items-center gap-4 p-4 rounded-2xl ${i < 3 ? "bg-card border border-border shadow-elevated" : "bg-secondary/30"}`}>
                  <div className="w-8 text-center">
                    {i < 3 ? <Medal className={`w-5 h-5 mx-auto ${getMedalColor(i)}`} /> : <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {(item.full_name || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.full_name || "Anonymous"}</p>
                  </div>
                  <div className="text-right">
                    {tab === "mentors" && (
                      <div>
                        <p className="text-sm font-bold">{item.total_sessions || 0} sessions</p>
                        <p className="text-xs text-muted-foreground">★ {item.avg_rating?.toFixed(1) || "—"}</p>
                      </div>
                    )}
                    {tab === "learners" && (
                      <p className="text-sm font-bold">{(item as any).sessions_attended || 0} attended</p>
                    )}
                    {tab === "contributors" && (
                      <p className="text-sm font-bold text-accent">{(item as any).credits_balance || 0} credits</p>
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

export default Leaderboard;
