import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminCareers = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const { data } = await supabase.from("careers").select("*").order("created_at", { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job listing? Applications will also be deleted.")) return;
    const { error } = await supabase.from("careers").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Job deleted"); fetchJobs(); }
  };

  const toggleStatus = async (job: any) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    const { error } = await supabase.from("careers").update({ status: newStatus }).eq("id", job.id);
    if (error) toast.error(error.message);
    else { toast.success(newStatus === "open" ? "Reopened" : "Closed"); fetchJobs(); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Career Listings</h1>
        <div className="flex gap-2">
          <Link to="/admin/applications">
            <Button variant="outline">Applications</Button>
          </Link>
          <Link to="/admin/careers/new">
            <Button><Plus className="w-4 h-4 mr-2" /> New Job</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No career listings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{job.title}</h3>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {[job.department, job.location, job.job_type].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="icon" onClick={() => toggleStatus(job)} title={job.status === "open" ? "Close" : "Reopen"}>
                  {job.status === "open" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Link to={`/admin/careers/${job.id}`}>
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </Link>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteJob(job.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCareers;
