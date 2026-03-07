import { motion } from "framer-motion";
import { Brain, Users, GraduationCap, LayoutDashboard, Star, ArrowLeftRight } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Skill Matching", desc: "Our algorithm finds the perfect learning partner based on your skills and goals." },
  { icon: ArrowLeftRight, title: "Peer Learning", desc: "Exchange skills with others for free — teach what you know, learn what you don't." },
  { icon: GraduationCap, title: "Pro Tutors Marketplace", desc: "Book sessions with professional tutors and coaches at competitive rates." },
  { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Track your learning progress, upcoming sessions, and skill growth all in one place." },
  { icon: Star, title: "Ratings & Reviews", desc: "Make informed decisions with honest ratings and detailed reviews from learners." },
  { icon: Users, title: "Community Driven", desc: "Join a vibrant community of learners and teachers helping each other grow." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary">Features</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Everything you need to <span className="text-gradient">learn & grow</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          SkillSwap combines the best of peer learning and professional tutoring into one powerful platform.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group rounded-2xl bg-card-gradient border border-border p-6 hover:glow-primary transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
