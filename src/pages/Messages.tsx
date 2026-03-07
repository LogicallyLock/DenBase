import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";

interface Match {
  id: string;
  user_a: string;
  user_b: string;
  status: string;
  compatibility_score: number | null;
  other_profile?: any;
}

const Messages = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq("status", "accepted");

      if (data) {
        // Fetch profiles for other users
        const otherIds = data.map((m) => (m.user_a === user.id ? m.user_b : m.user_a));
        const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", otherIds);
        const enriched = data.map((m) => ({
          ...m,
          other_profile: profiles?.find((p) => p.user_id === (m.user_a === user.id ? m.user_b : m.user_a)),
        }));
        setMatches(enriched);
      }
      setLoading(false);
    };
    fetchMatches();
  }, [user]);

  useEffect(() => {
    if (!selectedMatch) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", selectedMatch.id)
        .order("created_at");
      setMessages(data || []);
    };
    fetchMessages();

    // Subscribe to realtime
    const channel = supabase
      .channel(`messages-${selectedMatch.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${selectedMatch.id}` },
        (payload) => { setMessages((prev) => [...prev, payload.new]); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedMatch]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || !user) return;
    const { error } = await supabase.from("messages").insert({
      match_id: selectedMatch.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });
    if (error) toast.error(error.message);
    else setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold">Messages</h1>
        </div>
      </header>

      <div className="flex-1 flex container mx-auto max-w-5xl">
        {/* Conversations list */}
        <div className="w-72 border-r border-border flex-shrink-0 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading...</div>
          ) : matches.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No conversations yet. Accept a match to start chatting!</p>
            </div>
          ) : (
            matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className={`w-full text-left px-4 py-4 border-b border-border hover:bg-secondary/50 transition-colors ${selectedMatch?.id === m.id ? "bg-secondary" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {(m.other_profile?.full_name || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{m.other_profile?.full_name || "User"}</p>
                    <p className="text-[10px] text-muted-foreground">Match score: {m.compatibility_score || "—"}%</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedMatch ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender_id === user?.id
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="hero" size="icon" type="submit">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
