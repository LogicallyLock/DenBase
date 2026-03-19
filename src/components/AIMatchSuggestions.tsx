import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type MatchResult = {
  user_id: string;
  score: number;
  reason: string;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    tutor_category: string | null;
    avg_rating: number | null;
    session_price: number | null;
  } | null;
};

const AIMatchSuggestions = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchMatches = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-skill-match");
      if (error) throw error;
      setMatches(data?.matches || []);
      if (data?.reason) toast.info(data.reason);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to fetch AI matches");
    }
    setLoading(false);
    setFetched(true);
  };

  if (!fetched && !loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold">AI Skill Matches</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Get personalized match suggestions based on your skill profile.
        </p>
        <Button variant="outline" size="sm" onClick={fetchMatches}>
          <Sparkles className="w-4 h-4 mr-2" /> Find Matches
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold">AI Skill Matches</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchMatches} disabled={loading}>
          {loading ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4">No matches found. Add more skills to your profile!</p>
      ) : (
        <div className="space-y-3">
          {matches.map((m, i) => (
            <motion.div
              key={m.user_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
                {m.profile?.avatar_url ? (
                  <img src={m.profile.avatar_url} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  (m.profile?.full_name || "?")[0]?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold truncate">{m.profile?.full_name || "Unknown"}</span>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{m.score}%</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{m.reason}</p>
              </div>
              <Link to={`/tutor/${m.profile?.id}`}>
                <Button variant="outline" size="sm" className="text-xs">View</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMatchSuggestions;
