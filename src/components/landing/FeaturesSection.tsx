import { motion } from "framer-motion";
import { Brain, Users, GraduationCap, LayoutDashboard, Star, ArrowLeftRight } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Skill Matching", desc: "Smart algorithms analyze your profile to find the most compatible learning partners and tutors.", tag: "AI-Powered" },
  { icon: ArrowLeftRight, title: "Peer Learning", desc: "Exchange skills with others for free — teach what you know, learn what you don't. Pure value exchange.", tag: "Free" },
  { icon: GraduationCap, title: "Pro Tutors Marketplace", desc: "Book sessions with vetted professional tutors and coaches at competitive, transparent rates.", tag: "Marketplace" },
  { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Track progress, manage sessions, view analytics, and get personalized learning recommendations.", tag: "Analytics" },
  { icon: Star, title: "Ratings & Reviews", desc: "Transparent reputation system with verified reviews so you always know what to expect.", tag: "Trust" },
  { icon: Users, title: "Community Driven", desc: "Join study groups, participate in skill challenges, and grow alongside thousands of learners.", tag: "Social" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

const FeaturesSection = () => (
  <section id="features" className="py-28 lg:py-36 relative">
    <div className="absolute inset-0 dotted-bg pointer-events-none opacity-50" />
    <div className="container mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          Platform Features
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] leading-tight">
          Everything you need to{" "}
          <span className="text-gradient">learn & grow</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          A complete learning platform that combines peer exchange with professional tutoring.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group rounded-2xl bg-card border border-border p-7 hover:shadow-raised hover:border-primary/20 transition-all duration-300 cursor-default"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-secondary px-2.5 py-1 rounded-full">
                {f.tag}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
