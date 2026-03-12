import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Plus, Users, FolderGit2, ExternalLink, X } from "lucide-react";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [myMemberships, setMyMemberships] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", skills_required: "", max_collaborators: 5, duration: "", github_repo: "" });

  const fetchProjects = async () => {
    const [projRes, memberRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      user ? supabase.from("project_members").select("project_id").eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);
    if (projRes.data) {
      // Get member counts
      const ids = projRes.data.map((p: any) => p.id);
      const { data: members } = await supabase.from("project_members").select("project_id").in("project_id", ids);
      const counts: Record<string, number> = {};
      members?.forEach((m: any) => { counts[m.project_id] = (counts[m.project_id] || 0) + 1; });
      setProjects(projRes.data.map((p: any) => ({ ...p, member_count: counts[p.id] || 0 })));
    }
    if (memberRes.data) setMyMemberships((memberRes.data as any[]).map((m: any) => m.project_id));
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user]);

  const createProject = async () => {
    if (!user || !form.title.trim()) return;
    const { data, error } = await supabase.from("projects").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      skills_required: form.skills_required.split(",").map((s) => s.trim()).filter(Boolean),
      max_collaborators: form.max_collaborators,
      duration: form.duration || null,
      github_repo: form.github_repo || null,
      creator_id: user.id,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    // Auto-join as creator
    await supabase.from("project_members").insert({ project_id: data.id, user_id: user.id, role: "creator" });
    toast.success("Project created!");
    setShowCreate(false);
    setForm({ title: "", description: "", skills_required: "", max_collaborators: 5, duration: "", github_repo: "" });
    fetchProjects();
  };

  const joinProject = async (projectId: string) => {
    if (!user) return;
    const { error } = await supabase.from("project_members").insert({ project_id: projectId, user_id: user.id });
    if (error) { toast.error(error.code === "23505" ? "Already a member" : error.message); return; }
    // Award credits
    await supabase.from("credit_transactions").insert({ user_id: user.id, amount: 5, type: "project_contribution", description: "Joined a project" });
    await supabase.from("profiles").update({ credits_balance: supabase.rpc ? undefined : 0 }).eq("user_id", user.id);
    // Simple increment via raw update
    const { data: profile } = await supabase.from("profiles").select("credits_balance").eq("user_id", user.id).single();
    if (profile) {
      await supabase.from("profiles").update({ credits_balance: ((profile as any).credits_balance || 0) + 5 }).eq("user_id", user.id);
    }
    toast.success("Joined project! +5 credits");
    fetchProjects();
  };

  const leaveProject = async (projectId: string) => {
    if (!user) return;
    await supabase.from("project_members").delete().eq("project_id", projectId).eq("user_id", user.id);
    toast.success("Left project");
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <Button variant="hero" size="sm" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="w-4 h-4 mr-1" /> Create Project
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold mb-2">Project Rooms</h1>
          <p className="text-muted-foreground mb-8">Collaborate, build, and earn SkillCredits together.</p>

          {/* Create form */}
          {showCreate && (
            <div className="rounded-2xl border border-primary/20 bg-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">New Project</h2>
                <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Build an AI Chatbot" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will the team build?" rows={3} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Skills Required (comma-separated)</Label>
                    <Input value={form.skills_required} onChange={(e) => setForm({ ...form, skills_required: e.target.value })} placeholder="React, Python, AI" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Collaborators</Label>
                    <Input type="number" value={form.max_collaborators} onChange={(e) => setForm({ ...form, max_collaborators: parseInt(e.target.value) || 5 })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="4 weeks" />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub Repo (optional)</Label>
                    <Input value={form.github_repo} onChange={(e) => setForm({ ...form, github_repo: e.target.value })} placeholder="https://github.com/..." />
                  </div>
                </div>
                <Button variant="hero" onClick={createProject} disabled={!form.title.trim()}>Create Project</Button>
              </div>
            </div>
          )}

          {/* Projects list */}
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <FolderGit2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No projects yet. Create the first one!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => {
                const isMember = myMemberships.includes(p.id);
                const isFull = p.member_count >= p.max_collaborators;
                return (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-raised transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-bold">{p.title}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === "open" ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                    {p.skills_required?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.skills_required.map((s: string) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {p.member_count}/{p.max_collaborators}
                        {p.duration && <span>· {p.duration}</span>}
                      </div>
                      <div className="flex gap-2">
                        {p.github_repo && (
                          <a href={p.github_repo} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5" /></Button>
                          </a>
                        )}
                        {isMember ? (
                          <Button variant="outline" size="sm" onClick={() => leaveProject(p.id)}>Leave</Button>
                        ) : (
                          <Button variant="default" size="sm" onClick={() => joinProject(p.id)} disabled={isFull || p.status !== "open"}>
                            {isFull ? "Full" : "Join"}
                          </Button>
                        )}
                      </div>
                    </div>
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

export default Projects;
