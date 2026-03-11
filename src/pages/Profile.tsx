import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X, GraduationCap, BookOpen } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [teachSkills, setTeachSkills] = useState<any[]>([]);
  const [learnSkills, setLearnSkills] = useState<any[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [addingType, setAddingType] = useState<"teach" | "learn" | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [profileRes, skillsRes, userSkillsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("skills").select("*").order("name"),
        supabase.from("user_skills").select("*, skills(name, category)").eq("user_id", user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (skillsRes.data) setAllSkills(skillsRes.data);
      if (userSkillsRes.data) {
        setTeachSkills(userSkillsRes.data.filter((s: any) => s.skill_type === "teach"));
        setLearnSkills(userSkillsRes.data.filter((s: any) => s.skill_type === "learn"));
      }
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      bio: profile.bio,
      experience_level: profile.experience_level,
      availability: profile.availability,
      is_tutor: profile.is_tutor,
      tutor_category: profile.tutor_category,
      session_price: profile.session_price,
    }).eq("user_id", user.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  const addSkill = async (skillId: string, type: "teach" | "learn") => {
    if (!user) return;
    const { error } = await supabase.from("user_skills").insert({
      user_id: user.id, skill_id: skillId, skill_type: type,
    });
    if (error) {
      if (error.code === "23505") toast.error("Skill already added");
      else toast.error(error.message);
      return;
    }
    // Refetch
    const { data } = await supabase.from("user_skills").select("*, skills(name, category)").eq("user_id", user.id);
    if (data) {
      setTeachSkills(data.filter((s: any) => s.skill_type === "teach"));
      setLearnSkills(data.filter((s: any) => s.skill_type === "learn"));
    }
    setAddingType(null);
    setSkillSearch("");
    toast.success("Skill added!");
  };

  const removeSkill = async (id: string) => {
    await supabase.from("user_skills").delete().eq("id", id);
    setTeachSkills((prev) => prev.filter((s) => s.id !== id));
    setLearnSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Skill removed");
  };

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <Button variant="hero" size="sm" onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-1" /> {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold mb-8">Edit Profile</h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell others about yourself..." rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <select
                  value={profile.experience_level || ""}
                  onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Input value={profile.availability || ""} onChange={(e) => setProfile({ ...profile, availability: e.target.value })} placeholder="e.g. Weekends" />
              </div>
            </div>

            {/* Tutor toggle */}
            <div className="rounded-2xl border border-border p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.is_tutor || false}
                  onChange={(e) => setProfile({ ...profile, is_tutor: e.target.checked })}
                  className="w-5 h-5 rounded border-border accent-primary"
                />
                <div>
                  <p className="text-sm font-semibold">Register as a Tutor</p>
                  <p className="text-xs text-muted-foreground">Offer paid sessions to students</p>
                </div>
              </label>
              {profile.is_tutor && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={profile.tutor_category || ""} onChange={(e) => setProfile({ ...profile, tutor_category: e.target.value })} placeholder="e.g. Programming" />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Price ($)</Label>
                    <Input type="number" value={profile.session_price || ""} onChange={(e) => setProfile({ ...profile, session_price: parseFloat(e.target.value) || null })} placeholder="50" />
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            {(["teach", "learn"] as const).map((type) => {
              const skills = type === "teach" ? teachSkills : learnSkills;
              const Icon = type === "teach" ? GraduationCap : BookOpen;
              return (
                <div key={type} className="rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-bold capitalize">Skills I {type}</h3>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setAddingType(addingType === type ? null : type)}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s: any) => (
                      <span key={s.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium">
                        {s.skills?.name}
                        <button onClick={() => removeSkill(s.id)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet</p>}
                  </div>
                  {addingType === type && (
                    <div className="mt-4">
                     <Input placeholder="Search skills..." value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} className="mb-2" />
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {filteredSkills.slice(0, 10).map((s) => (
                          <button
                            key={s.id}
                            onClick={() => addSkill(s.id, type)}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                          >
                            {s.name} <span className="text-muted-foreground">· {s.category}</span>
                          </button>
                        ))}
                        {filteredSkills.length === 0 && skillSearch.trim() && (
                          <button
                            onClick={async () => {
                              const { data, error } = await supabase.from("skills").insert({ name: skillSearch.trim(), category: "Custom" }).select().single();
                              if (error) { toast.error(error.message); return; }
                              setAllSkills((prev) => [...prev, data]);
                              await addSkill(data.id, type);
                            }}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-primary font-medium"
                          >
                            + Create "{skillSearch.trim()}"
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
