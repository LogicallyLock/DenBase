import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Building2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("job_listings")
        .select("*, companies(name, logo_url, description, website, verified)")
        .eq("id", id)
        .single();
      setJob(data);

      if (user) {
        const { data: existing } = await supabase
          .from("job_applications")
          .select("id")
          .eq("job_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();
        setHasApplied(!!existing);
      }

      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please sign in to apply");
      return;
    }
    setApplying(true);
    const { error } = await supabase.from("job_applications").insert({
      job_id: id!,
      user_id: user.id,
      cover_letter: coverLetter || null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Application submitted! AI screening will process shortly.");
      setShowForm(false);
      setHasApplied(true);

      // Trigger AI screening
      supabase.functions.invoke("ai-screen-candidate", {
        body: { applicationId: undefined }, // we need the id
      }).catch(() => {});

      // Get the application id and trigger screening
      const { data: appData } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", id!)
        .eq("user_id", user.id)
        .single();

      if (appData) {
        supabase.functions.invoke("ai-screen-candidate", {
          body: { applicationId: appData.id },
        }).catch(() => {});
      }
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-2/3" />
            <div className="h-4 bg-secondary rounded w-1/3" />
            <div className="h-64 bg-secondary rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-6 max-w-3xl text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Link to="/jobs" className="text-primary hover:underline">← Back to jobs</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to jobs
            </Link>

            <div className="flex items-start gap-4 mb-6">
              {job.companies?.logo_url && (
                <img src={job.companies.logo_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-border" />
              )}
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{job.companies?.name}</span>
                  {job.companies?.verified && <Badge variant="secondary" className="text-[10px] px-1 py-0">Verified</Badge>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-muted-foreground">
              {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.job_type}</span>
              {job.salary_range && <Badge>{job.salary_range}</Badge>}
            </div>

            {job.skills_required?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {job.skills_required.map((s: string) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">{job.description}</div>

            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Requirements</h2>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{job.requirements}</div>
              </div>
            )}

            {job.companies?.description && (
              <div className="mb-8 rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold mb-2">About {job.companies.name}</h2>
                <p className="text-sm text-muted-foreground">{job.companies.description}</p>
                {job.companies.website && (
                  <a href={job.companies.website} target="_blank" rel="noopener" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Visit website →
                  </a>
                )}
              </div>
            )}

            {hasApplied ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                <p className="font-semibold text-primary">✓ You've already applied for this position</p>
                <p className="text-sm text-muted-foreground mt-1">Your application is being reviewed with AI screening.</p>
              </div>
            ) : !showForm ? (
              <Button size="lg" onClick={() => setShowForm(true)}>
                <Send className="w-4 h-4 mr-2" /> Apply Now
              </Button>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold mb-4">Apply for {job.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your profile, skills, and experience will be automatically shared. An AI will screen your application against the job requirements.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cover">Cover Letter (optional)</Label>
                    <Textarea
                      id="cover"
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      maxLength={5000}
                      placeholder="Tell the company why you'd be great for this role..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleApply} disabled={applying}>
                      {applying ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
