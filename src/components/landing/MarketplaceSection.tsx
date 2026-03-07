import { motion } from "framer-motion";
import { Briefcase, Brain, Code, Languages, Compass, Megaphone, Palette, Dumbbell } from "lucide-react";

const categories = [
  { icon: Briefcase, label: "Business Coaching", color: "text-accent" },
  { icon: Brain, label: "Meditation", color: "text-primary" },
  { icon: Code, label: "Programming", color: "text-primary" },
  { icon: Languages, label: "Languages", color: "text-accent" },
  { icon: Compass, label: "Career Mentorship", color: "text-primary" },
  { icon: Megaphone, label: "Marketing", color: "text-accent" },
  { icon: Palette, label: "Design", color: "text-primary" },
  { icon: Dumbbell, label: "Fitness", color: "text-accent" },
];

const MarketplaceSection = () => (
  <section id="marketplace" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-accent">Tutor Marketplace</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Find expert tutors in <span className="text-gradient">any category</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Browse professional tutors and coaches across dozens of skill categories.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((c, i) => (
          <motion.button
            key={c.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.04 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 hover:glow-primary transition-all duration-200 cursor-pointer"
          >
            <c.icon className={`w-8 h-8 ${c.color}`} />
            <span className="text-sm font-semibold">{c.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);

export default MarketplaceSection;
