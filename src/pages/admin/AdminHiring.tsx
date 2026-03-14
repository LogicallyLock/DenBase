import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Brain, Building2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminHiring = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [c, j, a] = await Promise.all([
      supabase.from("companies").select("*").order("created_at", { ascending: false }),
      supabase.from("job_listings").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("job_applications").select("*, job_listings(title, companies(name))").order("created_at", { ascending: false }),
    ]);
    setCompanies(c.data || []);
    setJobs(j.data || []);
    setApps(a.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleVerify = async (id: string, current: boolean) => {
    await supabase.from("companies").update({ verified: !current }).eq("id", id);
    toast.success(current ? "Unverified" : "Verified");
    fetchAll();
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("Delete company and all its jobs?")) return;
    await supabase.from("companies").delete().eq("id", id);
    toast.success("Deleted");
    fetchAll();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("job_applications").update({ status }).eq("id", id);
    toast.success("Updated");
    fetchAll();
  };

  const deleteApp = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    await supabase.from("job_applications").delete().eq("id", id);
    toast.success("Deleted");
    fetchAll();
  };

  const triggerScreening = async (appId: string) => {
    toast.info("Running AI screening...");
    const { data, error } = await supabase.functions.invoke("ai-screen-candidate", {
      body: { applicationId: appId },
    });
    if (error) toast.error("Screening failed");
    else { toast.success(`Score: ${data?.score}/100`); fetchAll(); }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Hiring Marketplace</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Applications ({apps.length})</TabsTrigger>
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="space-y-3">
              {apps.map((app) => {
                let screening: any = null;
                try { screening = app.screening_summary ? JSON.parse(app.screening_summary) : null; } catch {}

                return (
                  <div key={app.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link to={`/tutor/${app.user_id}`} className="font-semibold hover:text-primary flex items-center gap-1">
                            View Profile <ExternalLink className="w-3 h-3" />
                          </Link>
                          <Badge variant={app.status === "accepted" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                            {app.status}
                          </Badge>
                          {app.screening_score != null && (
                            <Badge variant={app.screening_score >= 70 ? "default" : "secondary"}>
                              AI: {app.screening_score}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          For: {app.job_listings?.title} at {app.job_listings?.companies?.name} · {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        {screening?.summary && <p className="text-sm text-muted-foreground mt-2">{screening.summary}</p>}
                        {app.cover_letter && <p className="text-sm text-muted-foreground mt-2 border-t border-border pt-2">{app.cover_letter}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!app.screening_score && (
                          <Button size="sm" variant="outline" onClick={() => triggerScreening(app.id)}>
                            <Brain className="w-3 h-3 mr-1" /> Screen
                          </Button>
                        )}
                        <Select value={app.status} onValueChange={(v) => updateAppStatus(app.id, v)}>
                          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="screened">Screened</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
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
                );
              })}
              {apps.length === 0 && <p className="text-center py-12 text-muted-foreground">No applications</p>}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="space-y-3">
              {companies.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{c.name}</h3>
                        {c.verified && <Badge className="text-[10px]">Verified</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.website || "No website"} · {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleVerify(c.id, c.verified)}>
                      {c.verified ? "Unverify" : "Verify"}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCompany(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {companies.length === 0 && <p className="text-center py-12 text-muted-foreground">No companies</p>}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="space-y-3">
              {jobs.map((j) => (
                <div key={j.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{j.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {j.companies?.name} · {j.job_type} · {j.location || "Remote"} ·{" "}
                      <Badge variant={j.status === "open" ? "default" : "secondary"} className="text-[10px]">{j.status}</Badge>
                    </p>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <p className="text-center py-12 text-muted-foreground">No jobs</p>}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
};

export default AdminHiring;
