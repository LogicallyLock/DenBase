import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Ban, CheckCircle } from "lucide-react";

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setProfiles(data || []);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const deleteProfile = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Profile deleted"); fetchProfiles(); }
  };

  const toggleTutor = async (id: string, current: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_tutor: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Tutor status ${!current ? "enabled" : "disabled"}`); fetchProfiles(); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-extrabold mb-6">User Management</h1>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-semibold">Name</th>
                <th className="text-left p-3 font-semibold">Level</th>
                <th className="text-left p-3 font-semibold">Category</th>
                <th className="text-left p-3 font-semibold">Tutor</th>
                <th className="text-left p-3 font-semibold">Sessions</th>
                <th className="text-left p-3 font-semibold">Rating</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{p.full_name || "—"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.bio || "No bio"}</p>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{p.experience_level || "—"}</td>
                  <td className="p-3">{p.tutor_category || "—"}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleTutor(p.id, p.is_tutor)}>
                      {p.is_tutor ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Ban className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </td>
                  <td className="p-3">{p.total_sessions || 0}</td>
                  <td className="p-3">{p.avg_rating?.toFixed(1) || "—"}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteProfile(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
