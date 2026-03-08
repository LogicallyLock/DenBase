import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Careers = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("careers")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setJobs(data || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Careers at Denbase</h1>
            <p className="text-muted-foreground mb-10">
              Join our mission to make skill exchange accessible to everyone. We're looking for passionate people to help build the future of peer learning.
            </p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                    <div className="h-5 bg-secondary rounded w-1/3 mb-3" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-border bg-card">
                <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-lg font-bold mb-2">No open positions right now</h2>
                <p className="text-sm text-muted-foreground">Check back soon or follow us for updates!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/careers/${job.id}`}
                      className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:shadow-raised hover:border-primary/20 transition-all duration-200"
                    >
                      <div>
                        <h2 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {job.department && <Badge variant="secondary">{job.department}</Badge>}
                          {job.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          )}
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.job_type}</span>
                          {job.salary_range && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.salary_range}</span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
