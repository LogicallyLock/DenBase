import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight, Building2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("job_listings")
        .select("*, companies(name, logo_url, verified)")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setJobs(data || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || j.job_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Talent Marketplace</h1>
            <p className="text-muted-foreground mb-8">
              Discover opportunities from companies looking for skilled talent.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                    <div className="h-5 bg-secondary rounded w-1/3 mb-3" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-border bg-card">
                <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-lg font-bold mb-2">No jobs found</h2>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/jobs/${job.id}`}
                      className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 hover:shadow-raised hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                            {job.title}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {job.companies?.name || "Unknown"}
                            {job.companies?.verified && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">✓</Badge>
                            )}
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.job_type}
                          </span>
                          {job.salary_range && (
                            <span className="text-foreground font-medium">{job.salary_range}</span>
                          )}
                        </div>
                        {job.skills_required?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.skills_required.slice(0, 5).map((s: string) => (
                              <Badge key={s} variant="outline" className="text-xs">
                                {s}
                              </Badge>
                            ))}
                            {job.skills_required.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills_required.length - 5}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
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

export default Jobs;
