import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

const applicationSchema = z.object({
  applicant_name: z.string().trim().min(1, "Name is required").max(100),
  applicant_email: z.string().trim().email("Invalid email").max(255),
  cover_letter: z.string().trim().max(5000).optional(),
});

const CareerDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ applicant_name: "", applicant_email: "", cover_letter: "" });

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await supabase.from("careers").select("*").eq("id", id).single();
      setJob(data);
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const result = applicationSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setApplying(true);
    const { error } = await supabase.from("career_applications").insert({
      career_id: id!,
      applicant_name: result.data.applicant_name,
      applicant_email: result.data.applicant_email,
      cover_letter: result.data.cover_letter || null,
      user_id: user?.id || null,
    });
    if (error) {
      toast.error(user ? error.message : "Please log in to apply");
    } else {
      toast.success("Application submitted! We'll be in touch.");
      setShowForm(false);
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
          <h1 className="text-2xl font-bold mb-4">Position not found</h1>
          <Link to="/careers" className="text-primary hover:underline">← Back to careers</Link>
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
            <Link to="/careers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to careers
            </Link>

            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-muted-foreground">
              {job.department && <Badge variant="secondary">{job.department}</Badge>}
              {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.job_type}</span>
              {job.salary_range && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.salary_range}</span>}
            </div>

            <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">{job.description}</div>

            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Requirements</h2>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{job.requirements}</div>
              </div>
            )}

            {job.benefits && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">Benefits</h2>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{job.benefits}</div>
              </div>
            )}

            {!showForm ? (
              <Button size="lg" onClick={() => setShowForm(true)}>
                <Send className="w-4 h-4 mr-2" /> Apply Now
              </Button>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold mb-4">Apply for {job.title}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} maxLength={100} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.applicant_email} onChange={(e) => setForm({ ...form, applicant_email: e.target.value })} maxLength={255} />
                  </div>
                  <div>
                    <Label htmlFor="cover">Cover Letter</Label>
                    <Textarea id="cover" rows={5} value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} maxLength={5000} placeholder="Tell us why you'd be great for this role..." />
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

export default CareerDetail;
