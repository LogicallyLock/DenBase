import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, DollarSign, Clock, BookOpen, UserCheck,
  CalendarDays, X, Video, Users, Repeat
} from "lucide-react";

const SESSION_TYPES = [
  { value: "video", label: "Video Call", icon: Video },
  { value: "peer_exchange", label: "Skill Exchange", icon: Repeat },
  { value: "group", label: "Group Session", icon: Users },
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const TutorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchStatus, setMatchStatus] = useState<string | null>(null);
  const [sendingMatch, setSendingMatch] = useState(false);

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("video");
  const [sessionTitle, setSessionTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (prof) {
        setProfile(prof);
        const { data: sk } = await supabase
          .from("user_skills")
          .select("*, skills(name, category)")
          .eq("user_id", prof.user_id);
        setSkills(sk || []);

        // Check existing match
        if (user) {
          const { data: existingMatch } = await supabase
            .from("matches")
            .select("status")
            .or(
              `and(user_a.eq.${user.id},user_b.eq.${prof.user_id}),and(user_a.eq.${prof.user_id},user_b.eq.${user.id})`
            )
            .maybeSingle();
          if (existingMatch) setMatchStatus(existingMatch.status);
        }
      }
      setLoading(false);
    };
    if (id) fetchData();
  }, [id, user]);

  const sendMatchRequest = async () => {
    if (!user || !profile) return;
    setSendingMatch(true);
    const { error } = await supabase.from("matches").insert({
      user_a: user.id,
      user_b: profile.user_id,
      status: "pending",
      compatibility_score: 0,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Match request sent!");
      setMatchStatus("pending");
    }
    setSendingMatch(false);
  };

  const bookSession = async () => {
    if (!user || !profile || !selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    setBooking(true);

    const scheduledAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const { error } = await supabase.from("sessions").insert({
      host_id: profile.user_id,
      participant_id: user.id,
      scheduled_at: scheduledAt.toISOString(),
      session_type: sessionType,
      title: sessionTitle || `Session with ${profile.full_name}`,
      duration_minutes: duration,
      price: profile.session_price || 0,
      status: "scheduled",
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Session booked successfully!");
      setShowBooking(false);
      setSelectedDate(undefined);
      setSelectedTime("");
      setSessionTitle("");
    }
    setBooking(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Profile not found
      </div>
    );

  const teachSkills = skills.filter((s) => s.skill_type === "teach");
  const learnSkills = skills.filter((s) => s.skill_type === "learn");
  const isOwnProfile = user?.id === profile.user_id;

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

            {/* Action buttons */}
            {!isOwnProfile && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                {!matchStatus && (
                  <Button variant="outline" onClick={sendMatchRequest} disabled={sendingMatch}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    {sendingMatch ? "Sending..." : "Send Match Request"}
                  </Button>
                )}
                {matchStatus === "pending" && (
                  <Button variant="outline" disabled>
                    <Clock className="w-4 h-4 mr-2" /> Match Pending
                  </Button>
                )}
                {matchStatus === "accepted" && (
                  <Button variant="outline" disabled>
                    <UserCheck className="w-4 h-4 mr-2" /> Matched ✓
                  </Button>
                )}
                <Button variant="hero" onClick={() => setShowBooking(true)}>
                  <CalendarDays className="w-4 h-4 mr-2" /> Book Session
                </Button>
              </div>
            )}
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

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-lg font-bold">Book a Session</h2>
                <button onClick={() => setShowBooking(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Session title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Title</label>
                  <Input
                    placeholder={`Session with ${profile.full_name}`}
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                  />
                </div>

                {/* Session type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SESSION_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setSessionType(t.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                          sessionType === t.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <div className="flex gap-2">
                    {[30, 60, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                          duration === d
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-xl border border-border"
                    />
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                            selectedTime === t
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price info */}
                {profile.session_price > 0 && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                    <span className="text-sm text-muted-foreground">Session Price</span>
                    <span className="text-lg font-bold text-primary">${profile.session_price}</span>
                  </div>
                )}

                <Button
                  variant="hero"
                  className="w-full"
                  onClick={bookSession}
                  disabled={booking || !selectedDate || !selectedTime}
                >
                  {booking ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorProfile;
