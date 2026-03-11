import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

const AdminSkills = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*").order("category").order("name");
    setSkills(data || []);
  };

  useEffect(() => { fetchSkills(); }, []);

  const addSkill = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("skills").insert({ name: newName.trim(), category: newCategory.trim() || null });
    if (error) toast.error(error.message);
    else { toast.success("Skill added"); setNewName(""); setNewCategory(""); fetchSkills(); }
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Skill deleted"); fetchSkills(); }
  };

  const categories = [...new Set(skills.map((s) => s.category).filter(Boolean))];

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-extrabold mb-6">Skills & Categories</h1>

        {/* Add skill */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-bold mb-3">Add New Skill</h2>
          <div className="flex gap-3">
            <Input placeholder="Skill name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
            <Input placeholder="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-40" />
            <Button onClick={addSkill}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </div>
        </div>

        {/* Skills by category */}
        {categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="text-sm font-bold text-muted-foreground mb-2">{cat}</h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {skills.filter((s) => s.category === cat).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-secondary/20">
                  <span className="font-medium">{s.name}</span>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSkill(s.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Uncategorized */}
        {skills.filter((s) => !s.category).length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-muted-foreground mb-2">Uncategorized</h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {skills.filter((s) => !s.category).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-secondary/20">
                  <span className="font-medium">{s.name}</span>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSkill(s.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSkills;
