import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Trash2 } from "lucide-react";

const AdminApplications = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    const { data } = await supabase
      .from("career_applications")
      .select("*, careers(title)")
      .order("created_at", { ascending: false });
    setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("career_applications").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); fetchApps(); }
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("career_applications").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetchApps(); }
  };

  const statusColor = (s: string) => {
    if (s === "reviewed") return "default";
    if (s === "accepted") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><p>No applications yet.</p></div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{app.applicant_name}</h3>
                    <Badge variant={statusColor(app.status) as any}>{app.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    For: {app.careers?.title || "Unknown"} · {new Date(app.created_at).toLocaleDateString()}
                  </p>
                  <a href={`mailto:${app.applicant_email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {app.applicant_email}
                  </a>
                  {app.cover_letter && (
                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap border-t border-border pt-3">{app.cover_letter}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v)}>
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deleteApp(app.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
