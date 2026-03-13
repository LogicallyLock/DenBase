import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, X, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const STATUSES = ["active", "closed"];

const AdminChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [tab, setTab] = useState<"challenges" | "submissions">("challenges");
  const [form, setForm] = useState({
    title: "", description: "", skill_category: "", difficulty: "intermediate",
    credit_reward: 20, deadline: "", status: "active",
  });

  const fetchData = async () => {
    const [chalRes, subRes] = await Promise.all([
      supabase.from("challenges").select("*").order("created_at", { ascending: false }),
      supabase.from("challenge_submissions").select("*, challenges(title)").order("created_at", { ascending: false }),
    ]);
    if (chalRes.data) setChallenges(chalRes.data);
    if (subRes.data) setSubmissions(subRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", skill_category: "", difficulty: "intermediate", credit_reward: 20, deadline: "", status: "active" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    const payload = {
      title: form.title,
      description: form.description,
      skill_category: form.skill_category || null,
      difficulty: form.difficulty,
      credit_reward: form.credit_reward,
      deadline: form.deadline || null,
      status: form.status,
      ...(editing ? {} : { created_by: user!.id }),
    };

    const { error } = editing
      ? await supabase.from("challenges").update(payload).eq("id", editing.id)
      : await supabase.from("challenges").insert(payload);

    if (error) toast.error(error.message);
    else { toast.success(editing ? "Challenge updated" : "Challenge created"); resetForm(); fetchData(); }
  };

  const deleteChallenge = async (id: string) => {
    const { error } = await supabase.from("challenges").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Challenge deleted"); fetchData(); }
  };

  const editChallenge = (c: any) => {
    setForm({
      title: c.title, description: c.description, skill_category: c.skill_category || "",
      difficulty: c.difficulty, credit_reward: c.credit_reward, deadline: c.deadline?.split("T")[0] || "", status: c.status,
    });
    setEditing(c);
    setShowForm(true);
  };

  const reviewSubmission = async (id: string, status: "approved" | "rejected", challengeReward: number, userId: string) => {
    const { error } = await supabase.from("challenge_submissions").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }

    if (status === "approved") {
      // Award credits
      await supabase.from("credit_transactions").insert({
        user_id: userId, amount: challengeReward, type: "challenge_reward",
        description: "Challenge reward", reference_id: id,
      });
      await supabase.from("profiles").update({
        credits_balance: (await supabase.from("profiles").select("credits_balance").eq("user_id", userId).single()).data?.credits_balance + challengeReward,
      }).eq("user_id", userId);
    }

    toast.success(`Submission ${status}`);
    fetchData();
  };

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle2 className="w-4 h-4 text-accent" />;
    if (s === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">Challenges</h1>
          <div className="flex gap-2">
            <Button variant={tab === "challenges" ? "default" : "outline"} size="sm" onClick={() => setTab("challenges")}>
              <Trophy className="w-4 h-4 mr-1" /> Challenges
            </Button>
            <Button variant={tab === "submissions" ? "default" : "outline"} size="sm" onClick={() => setTab("submissions")}>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Submissions
              {submissions.filter(s => s.status === "pending").length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-destructive text-destructive-foreground">
                  {submissions.filter(s => s.status === "pending").length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {tab === "challenges" && (
          <>
            {!showForm && (
              <Button className="mb-4" onClick={() => { resetForm(); setShowForm(true); }}>
                <Plus className="w-4 h-4 mr-1" /> New Challenge
              </Button>
            )}

            {showForm && (
              <div className="rounded-2xl border border-border bg-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold">{editing ? "Edit Challenge" : "New Challenge"}</h2>
                  <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Title</Label>
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Challenge title" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Category</Label>
                    <Input value={form.skill_category} onChange={(e) => setForm({ ...form, skill_category: e.target.value })} placeholder="e.g. Web Dev" />
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button key={d} onClick={() => setForm({ ...form, difficulty: d })}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize ${form.difficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Credit Reward</Label>
                    <Input type="number" value={form.credit_reward} onChange={(e) => setForm({ ...form, credit_reward: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex gap-2">
                      {STATUSES.map((s) => (
                        <button key={s} onClick={() => setForm({ ...form, status: s })}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium capitalize ${form.status === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {challenges.map((c) => (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-5 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{c.title}</h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary capitalize">{c.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>+{c.credit_reward} credits</span>
                      {c.deadline && <span>Due: {new Date(c.deadline).toLocaleDateString()}</span>}
                      {c.skill_category && <span>{c.skill_category}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => editChallenge(c)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteChallenge(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
              {challenges.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No challenges yet.</p>}
            </div>
          </>
        )}

        {tab === "submissions" && (
          <div className="space-y-3">
            {submissions.map((s) => {
              const challenge = challenges.find((c) => c.id === s.challenge_id);
              return (
                <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {statusIcon(s.status)}
                        <h3 className="font-bold text-sm">{(s.challenges as any)?.title || "Unknown Challenge"}</h3>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary capitalize">{s.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">User: {s.user_id.slice(0, 8)}...</p>
                      {s.submission_url && <p className="text-xs text-primary mt-1"><a href={s.submission_url} target="_blank" rel="noreferrer">{s.submission_url}</a></p>}
                      {s.notes && <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</p>
                    </div>
                    {s.status === "pending" && (
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" onClick={() => reviewSubmission(s.id, "approved", challenge?.credit_reward || 20, s.user_id)}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => reviewSubmission(s.id, "rejected", 0, s.user_id)}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {submissions.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No submissions yet.</p>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChallenges;
