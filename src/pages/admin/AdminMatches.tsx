import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const AdminMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);

  const fetchMatches = async () => {
    const { data } = await supabase.from("matches").select("*").order("created_at", { ascending: false });
    if (!data) return setMatches([]);
    // Enrich with profiles
    const userIds = [...new Set(data.flatMap((m: any) => [m.user_a, m.user_b]))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
    setMatches(data.map((m: any) => ({ ...m, name_a: profileMap[m.user_a] || m.user_a, name_b: profileMap[m.user_b] || m.user_b })));
  };

  useEffect(() => { fetchMatches(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("matches").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Match ${status}`); fetchMatches(); }
  };

  const deleteMatch = async (id: string) => {
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Match deleted"); fetchMatches(); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-extrabold mb-6">Match Management</h1>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-semibold">User A</th>
                <th className="text-left p-3 font-semibold">User B</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Score</th>
                <th className="text-left p-3 font-semibold">Date</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="p-3 font-medium">{m.name_a}</td>
                  <td className="p-3 font-medium">{m.name_b}</td>
                  <td className="p-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      m.status === "accepted" ? "bg-green-500/10 text-green-600" :
                      m.status === "pending" ? "bg-primary/10 text-primary" :
                      "bg-destructive/10 text-destructive"
                    }`}>{m.status}</span>
                  </td>
                  <td className="p-3">{m.compatibility_score || 0}%</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right flex gap-1 justify-end">
                    {m.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(m.id, "accepted")}>Accept</Button>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(m.id, "declined")}>Decline</Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMatch(m.id)}>
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

export default AdminMatches;
