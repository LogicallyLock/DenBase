import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, Filter, DollarSign, MessageSquare } from "lucide-react";

const Marketplace = () => {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("profiles").select("*").eq("is_tutor", true);
      if (categoryFilter) query = query.eq("tutor_category", categoryFilter);
      const { data } = await query;
      setTutors(data || []);
      setLoading(false);
    };
    fetch();
  }, [categoryFilter]);

  const filteredTutors = tutors.filter((t) =>
    (t.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.tutor_category || "").toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(tutors.map((t) => t.tutor_category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-6 flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-bold">Tutor Marketplace</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Search & filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tutors..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={categoryFilter === "" ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter("")}>All</Button>
              {categories.map((c) => (
                <Button key={c} variant={categoryFilter === c ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(c as string)}>
                  {c}
                </Button>
              ))}
            </div>
          </div>

          {/* Tutors grid */}
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading tutors...</div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">No tutors found</p>
              <p className="text-xs text-muted-foreground">Be the first! Update your profile to register as a tutor.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTutors.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-elevated hover:shadow-raised transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {(t.full_name || "?")[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">{t.full_name || "Unnamed"}</h3>
                      <p className="text-xs text-muted-foreground">{t.tutor_category || "General"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{t.bio || "No bio yet"}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        {t.avg_rating?.toFixed(1) || "New"}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <DollarSign className="w-3 h-3" />{t.session_price || "Free"}
                      </span>
                    </div>
                    <Link to={`/tutor/${t.id}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Marketplace;
