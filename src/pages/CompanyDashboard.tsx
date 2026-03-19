import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Building2, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState({ name: "", description: "", website: "", logo_url: "" });
  const [jobForm, setJobForm] = useState({
    title: "", description: "", requirements: "", location: "", job_type: "full-time",
    salary_range: "", skills_required: "", min_experience: "", min_rating: "",
  });

  const fetchData = async () => {
    if (!user) return;
    const { data: comp } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setCompany(comp);

    if (comp) {
      const { data: jobData } = await supabase
        .from("job_listings")
        .select("*")
        .eq("company_id", comp.id)
        .order("created_at", { ascending: false });
      setJobs(jobData || []);

      const jobIds = (jobData || []).map((j: any) => j.id);
      if (jobIds.length > 0) {
        const { data: appData } = await supabase
          .from("job_applications")
          .select("*, job_listings(title)")
          .in("job_id", jobIds)
          .order("screening_score", { ascending: false });
        setApplications(appData || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const registerCompany = async () => {
    if (!companyForm.name.trim()) { toast.error("Company name is required"); return; }
    const { error } = await supabase.from("companies").insert({
      ...companyForm,
      user_id: user!.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Company registered!"); fetchData(); setShowRegister(false); }
  };

  const createJob = async () => {
    if (!jobForm.title.trim()) { toast.error("Job title is required"); return; }
    const screening_criteria: any = {};
    if (jobForm.min_experience) screening_criteria.min_experience = jobForm.min_experience;
    if (jobForm.min_rating) screening_criteria.min_rating = jobForm.min_rating;

    const { error } = await supabase.from("job_listings").insert({
      company_id: company.id,
      title: jobForm.title,
      description: jobForm.description,
      requirements: jobForm.requirements,
      location: jobForm.location,
      job_type: jobForm.job_type,
      salary_range: jobForm.salary_range,
      skills_required: jobForm.skills_required.split(",").map((s: string) => s.trim()).filter(Boolean),
      screening_criteria,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Job posted!");
      setShowJobForm(false);
      setJobForm({ title: "", description: "", requirements: "", location: "", job_type: "full-time", salary_range: "", skills_required: "", min_experience: "", min_rating: "" });
      fetchData();
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Delete this job listing?")) return;
    await supabase.from("job_listings").delete().eq("id", id);
    toast.success("Deleted");
    fetchData();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("job_applications").update({ status }).eq("id", id);
    toast.success("Updated");
    fetchData();
  };

  const triggerScreening = async (appId: string) => {
    toast.info("Running AI screening...");
    const { data, error } = await supabase.functions.invoke("ai-screen-candidate", {
      body: { applicationId: appId },
    });
    if (error) toast.error("Screening failed");
    else { toast.success(`Screening complete! Score: ${data?.score}/100`); fetchData(); }
  };

  const jobApps = selectedJob
    ? applications.filter((a) => a.job_id === selectedJob)
    : applications;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6 max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!company && !showRegister) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6 max-w-3xl">
          <div className="text-center py-20 rounded-2xl border border-border bg-card">
            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Register Your Company</h1>
            <p className="text-muted-foreground mb-6">Create a company profile to start posting jobs and finding talent.</p>
            <Button size="lg" onClick={() => setShowRegister(true)}>Get Started</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6 max-w-xl">
          <h1 className="text-2xl font-extrabold mb-6">Register Company</h1>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div><Label>Company Name *</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} /></div>
            <div><Label>Website</Label><Input value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} placeholder="https://" /></div>
            <div><Label>Logo URL</Label><Input value={companyForm.logo_url} onChange={(e) => setCompanyForm({ ...companyForm, logo_url: e.target.value })} /></div>
            <div className="flex gap-3">
              <Button onClick={registerCompany}>Register</Button>
              <Button variant="outline" onClick={() => setShowRegister(false)}>Cancel</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold">{company.name}</h1>
                <p className="text-muted-foreground">Company Dashboard</p>
              </div>
              <Button onClick={() => setShowJobForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Post Job
              </Button>
            </div>

            {/* Post Job Form */}
            {showJobForm && (
              <div className="rounded-2xl border border-border bg-card p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">Post a New Job</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><Label>Job Title *</Label><Input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} /></div>
                  <div className="md:col-span-2"><Label>Description</Label><Textarea rows={4} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} /></div>
                  <div className="md:col-span-2"><Label>Requirements</Label><Textarea rows={3} value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} /></div>
                  <div><Label>Location</Label><Input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} placeholder="Remote, NYC, etc." /></div>
                  <div>
                    <Label>Job Type</Label>
                    <Select value={jobForm.job_type} onValueChange={(v) => setJobForm({ ...jobForm, job_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Salary Range</Label><Input value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} placeholder="$50k-$80k" /></div>
                  <div><Label>Required Skills (comma-separated)</Label><Input value={jobForm.skills_required} onChange={(e) => setJobForm({ ...jobForm, skills_required: e.target.value })} placeholder="React, TypeScript, Node.js" /></div>

                  <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> AI Screening Criteria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Minimum Experience Level</Label>
                        <Select value={jobForm.min_experience} onValueChange={(v) => setJobForm({ ...jobForm, min_experience: v })}>
                          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Minimum Rating</Label><Input type="number" min="0" max="5" step="0.5" value={jobForm.min_rating} onChange={(e) => setJobForm({ ...jobForm, min_rating: e.target.value })} placeholder="e.g. 3.5" /></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={createJob}>Publish Job</Button>
                  <Button variant="outline" onClick={() => setShowJobForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Jobs List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-lg font-bold mb-4">Your Jobs ({jobs.length})</h2>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        selectedJob === job.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                      }`}
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={job.status === "open" ? "default" : "secondary"} className="text-[10px]">
                              {job.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {applications.filter((a) => a.job_id === job.id).length} apps
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No jobs posted yet</p>}
                </div>
              </div>

              {/* Applications */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-bold mb-4">
                  Applications ({jobApps.length})
                  {selectedJob && <span className="text-sm text-muted-foreground font-normal ml-2">— {jobs.find((j) => j.id === selectedJob)?.title}</span>}
                </h2>
                <div className="space-y-3">
                  {jobApps.map((app) => {
                    let screening: any = null;
                    try { screening = app.screening_summary ? JSON.parse(app.screening_summary) : null; } catch {}

                    return (
                      <div key={app.id} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link to={`/tutor/${app.user_id}`} className="font-semibold hover:text-primary">
                                View Profile
                              </Link>
                              <Badge variant={app.status === "screened" ? "default" : app.status === "accepted" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>
                                {app.status}
                              </Badge>
                              {app.screening_score != null && (
                                <Badge variant={app.screening_score >= 70 ? "default" : app.screening_score >= 40 ? "secondary" : "destructive"}>
                                  Score: {app.screening_score}/100
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              For: {app.job_listings?.title} · {new Date(app.created_at).toLocaleDateString()}
                            </p>
                            {screening?.summary && (
                              <p className="text-sm text-muted-foreground mt-2">{screening.summary}</p>
                            )}
                            {screening?.strengths?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {screening.strengths.map((s: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-[10px] text-green-600">{s}</Badge>
                                ))}
                              </div>
                            )}
                            {screening?.concerns?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {screening.concerns.map((c: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-[10px] text-orange-600">{c}</Badge>
                                ))}
                              </div>
                            )}
                            {app.cover_letter && (
                              <p className="text-sm text-muted-foreground mt-3 border-t border-border pt-3 whitespace-pre-wrap">{app.cover_letter}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {jobApps.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No applications yet</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDashboard;
