import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const AdminSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchSessions = async () => {
    const { data } = await supabase.from("sessions").select("*").order("created_at", { ascending: false });
    if (!data) return setSessions([]);
    const userIds = [...new Set(data.flatMap((s: any) => [s.host_id, s.participant_id]))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
    const map = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
    setSessions(data.map((s: any) => ({ ...s, host_name: map[s.host_id] || s.host_id, participant_name: map[s.participant_id] || s.participant_id })));
  };

  useEffect(() => { fetchSessions(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("sessions").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Session ${status}`); fetchSessions(); }
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Session deleted"); fetchSessions(); }
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary",
    completed: "bg-green-500/10 text-green-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-extrabold mb-6">Session Management</h1>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-3 font-semibold">Title</th>
                <th className="text-left p-3 font-semibold">Host</th>
                <th className="text-left p-3 font-semibold">Participant</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Date</th>
                <th className="text-left p-3 font-semibold">Price</th>
                <th className="text-right p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="p-3 font-medium">{s.title || "Untitled"}</td>
                  <td className="p-3">{s.host_name}</td>
                  <td className="p-3">{s.participant_name}</td>
                  <td className="p-3 capitalize">{s.session_type}</td>
                  <td className="p-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor[s.status] || ""}`}>{s.status}</span>
                  </td>
                  <td className="p-3 text-xs">{s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : "TBD"}</td>
                  <td className="p-3">{s.price ? `$${s.price}` : "Free"}</td>
                  <td className="p-3 text-right flex gap-1 justify-end">
                    {s.status === "scheduled" && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(s.id, "cancelled")}>Cancel</Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSession(s.id)}>
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

export default AdminSessions;
