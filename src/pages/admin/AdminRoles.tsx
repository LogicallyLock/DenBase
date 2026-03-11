import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus, Shield } from "lucide-react";

const AdminRoles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "user">("user");

  const fetchData = async () => {
    const [rolesRes, profilesRes] = await Promise.all([
      supabase.from("user_roles").select("*"),
      supabase.from("profiles").select("user_id, full_name"),
    ]);
    
    const rolesData = rolesRes.data || [];
    const profilesData = profilesRes.data || [];
    const profileMap = Object.fromEntries(profilesData.map((p: any) => [p.user_id, p.full_name]));
    
    setRoles(rolesData.map((r: any) => ({ ...r, full_name: profileMap[r.user_id] || r.user_id })));
    setProfiles(profilesData);
  };

  useEffect(() => { fetchData(); }, []);

  const addRole = async () => {
    if (!selectedUserId) return;
    const { error } = await supabase.from("user_roles").insert({
      user_id: selectedUserId,
      role: selectedRole,
    });
    if (error) toast.error(error.message);
    else { toast.success(`Role ${selectedRole} assigned`); setSelectedUserId(""); fetchData(); }
  };

  const removeRole = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Role removed"); fetchData(); }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-extrabold mb-6">Role Management</h1>

        {/* Assign role */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-bold mb-3">Assign Role</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">User</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select user...</option>
                {profiles.map((p) => (
                  <option key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</option>
                ))}
              </select>
            </div>
            <div className="w-40">
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <Button onClick={addRole}><Plus className="w-4 h-4 mr-1" /> Assign</Button>
          </div>
        </div>

        {/* Current roles */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-semibold">User</th>
                <th className="text-left p-3 font-semibold">Role</th>
                <th className="text-left p-3 font-semibold">Assigned</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="p-3 font-medium">{r.full_name}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                      <Shield className="w-3 h-3" /> {r.role}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeRole(r.id)}>
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

export default AdminRoles;
