import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Users, ArrowLeftRight, Calendar, BookOpen, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, matches: 0, sessions: 0, skills: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [u, m, s, sk] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("matches").select("id", { count: "exact", head: true }),
        supabase.from("sessions").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: u.count || 0,
        matches: m.count || 0,
        sessions: s.count || 0,
        skills: sk.count || 0,
      });
    };
    fetch();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-primary" },
    { label: "Total Matches", value: stats.matches, icon: ArrowLeftRight, color: "text-accent" },
    { label: "Total Sessions", value: stats.sessions, icon: Calendar, color: "text-primary" },
    { label: "Total Skills", value: stats.skills, icon: BookOpen, color: "text-accent" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-extrabold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
