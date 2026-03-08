import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Briefcase, Brain, Code, Languages, Compass, Megaphone, Palette, Dumbbell, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Briefcase, label: "Business Coaching", count: "120+ tutors", gradient: "from-amber-500/10 to-orange-500/10" },
  { icon: Brain, label: "Meditation & Wellness", count: "85+ tutors", gradient: "from-primary/10 to-teal-500/10" },
  { icon: Code, label: "Programming", count: "340+ tutors", gradient: "from-blue-500/10 to-indigo-500/10" },
  { icon: Languages, label: "Languages", count: "200+ tutors", gradient: "from-green-500/10 to-emerald-500/10" },
  { icon: Compass, label: "Career Mentorship", count: "95+ tutors", gradient: "from-purple-500/10 to-pink-500/10" },
  { icon: Megaphone, label: "Marketing", count: "110+ tutors", gradient: "from-rose-500/10 to-red-500/10" },
  { icon: Palette, label: "Design", count: "150+ tutors", gradient: "from-violet-500/10 to-purple-500/10" },
  { icon: Dumbbell, label: "Fitness", count: "75+ tutors", gradient: "from-cyan-500/10 to-sky-500/10" },
];

const MarketplaceSection = () => (
  <section id="marketplace" className="py-28 lg:py-36 relative">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            Tutor Marketplace
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] leading-tight">
            Find expert tutors in{" "}
            <span className="text-gradient">any category</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Browse hundreds of professional tutors and coaches. Book sessions at transparent prices with verified reviews.
          </p>
          <Link to="/marketplace">
            <Button variant="hero" size="lg" className="mt-8">
              Browse All Tutors <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {categories.map((c, i) => (
            <motion.button
              key={c.label}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 rounded-2xl border border-border bg-card p-5 hover:shadow-raised hover:border-primary/20 transition-all duration-300 cursor-pointer text-left`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold block truncate">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.count}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default MarketplaceSection;
