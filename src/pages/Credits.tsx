import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Gift, Users, Trophy, BookOpen, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const typeIcons: Record<string, any> = {
  session_earned: TrendingUp,
  session_spent: TrendingDown,
  challenge_reward: Trophy,
  referral_bonus: Users,
  signup_bonus: Gift,
  project_contribution: BookOpen,
};

const typeColors: Record<string, string> = {
  session_earned: "text-accent",
  session_spent: "text-destructive",
  challenge_reward: "text-primary",
  referral_bonus: "text-primary",
  signup_bonus: "text-accent",
  project_contribution: "text-primary",
};

const Credits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [profileRes, txRes] = await Promise.all([
        supabase.from("profiles").select("credits_balance").eq("user_id", user.id).single(),
        supabase.from("credit_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      ]);
      if (profileRes.data) setBalance((profileRes.data as any).credits_balance || 0);
      if (txRes.data) setTransactions(txRes.data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold mb-8">SkillCredits</h1>

          {/* Balance card */}
          <div className="rounded-2xl bg-hero-gradient p-6 text-primary-foreground mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Your Balance</span>
            </div>
            <p className="text-4xl font-extrabold">{balance} <span className="text-lg font-medium opacity-80">credits</span></p>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-xs opacity-70">Total Earned</p>
                <p className="text-lg font-bold">+{totalEarned}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Total Spent</p>
                <p className="text-lg font-bold">-{totalSpent}</p>
              </div>
            </div>
          </div>

          {/* How to earn */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">How to Earn Credits</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: BookOpen, label: "Teach a session", credits: "+10", desc: "Per hour taught" },
                { icon: Trophy, label: "Complete a challenge", credits: "+20", desc: "Submit solutions" },
                { icon: Users, label: "Refer a friend", credits: "+10", desc: "When they sign up" },
                { icon: Gift, label: "Project contribution", credits: "+5", desc: "Per contribution" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-accent">{item.credits}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction history */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-4">Transaction History</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No transactions yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start teaching or completing challenges to earn credits!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => {
                  const Icon = typeIcons[tx.type] || Coins;
                  const color = typeColors[tx.type] || "text-foreground";
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{tx.description || tx.type.replace(/_/g, " ")}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${tx.amount > 0 ? "text-accent" : "text-destructive"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Credits;
