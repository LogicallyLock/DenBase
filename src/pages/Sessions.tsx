import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Video } from "lucide-react";

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .or(`host_id.eq.${user.id},participant_id.eq.${user.id}`)
      .order("scheduled_at", { ascending: false });
    setSessions(data || []);
    setLoading(false);
  };

  const cancelSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    const { error } = await supabase.from("sessions").update({ status: "cancelled" }).eq("id", sessionId);
    if (error) { toast.error(error.message); return; }
    
    // Refund credits to participant
    if (session && session.price && session.participant_id) {
      const { data: pProfile } = await supabase.from("profiles").select("credits_balance").eq("user_id", session.participant_id).single();
      if (pProfile) {
        await supabase.from("profiles").update({ credits_balance: (pProfile as any).credits_balance + Number(session.price) }).eq("user_id", session.participant_id);
        await supabase.from("credit_transactions").insert({
          user_id: session.participant_id, amount: Number(session.price), type: "session_earned",
          description: "Session cancelled - refund",
        });
      }
    }
    toast.success("Session cancelled & credits refunded");
    fetchSessions();
  };

  const completeSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    const { error } = await supabase.from("sessions").update({ status: "completed" }).eq("id", sessionId);
    if (error) { toast.error(error.message); return; }

    // Award credits to host (teacher)
    const earnAmount = Math.round((Number(session.price) || 10) * 1);
    const { data: hostProfile } = await supabase.from("profiles").select("credits_balance, total_sessions").eq("user_id", session.host_id).single();
    if (hostProfile) {
      await supabase.from("profiles").update({
        credits_balance: (hostProfile as any).credits_balance + earnAmount,
        total_sessions: ((hostProfile as any).total_sessions || 0) + 1,
      }).eq("user_id", session.host_id);
      await supabase.from("credit_transactions").insert({
        user_id: session.host_id, amount: earnAmount, type: "session_earned",
        description: "Session teaching reward",
      });
    }

    // Update participant sessions_attended
    const { data: partProfile } = await supabase.from("profiles").select("sessions_attended").eq("user_id", session.participant_id).single();
    if (partProfile) {
      await supabase.from("profiles").update({
        sessions_attended: ((partProfile as any).sessions_attended || 0) + 1,
      }).eq("user_id", session.participant_id);
    }

    toast.success("Session completed! Credits awarded to teacher.");
    fetchSessions();
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary",
    completed: "bg-green-500/10 text-green-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center gap-4">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-lg font-bold">Sessions</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No sessions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Match with someone to schedule your first session!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{s.title || "Untitled Session"}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{s.description || "No description"}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColor[s.status] || ""}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : "TBD"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {s.duration_minutes || 60} min
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <Video className="w-3 h-3" />
                      {s.session_type}
                    </span>
                    {s.price && (
                      <span className="font-semibold text-primary">${s.price}</span>
                    )}
                  </div>
                  {s.status === "scheduled" && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => cancelSession(s.id)}>
                        Cancel Session
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Sessions;
