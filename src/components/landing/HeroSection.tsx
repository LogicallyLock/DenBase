import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroImg from "@/assets/hero-illustration.png";
import DemoModal from "./DemoModal";

const stats = [
  { value: "10K+", label: "Active Learners" },
  { value: "500+", label: "Skill Categories" },
  { value: "95%", label: "Match Rate" },
  { value: "4.9★", label: "Avg Rating" },
];

const HeroSection = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
  <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 grid-bg pointer-events-none" />
    <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

    <div className="container mx-auto px-6 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Skill Matching — Now in Beta
            </span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.08] tracking-[-0.02em]">
              Learn Anything by{" "}
              <span className="text-gradient">Teaching What You Know</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Exchange skills with peers for free or connect with professional tutors. 
              Our AI matches you with the perfect learning partner.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="gap-2" onClick={() => setDemoOpen(true)}>
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-3 h-3 text-primary ml-0.5" />
              </div>
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-5 pt-2">
            <div className="flex -space-x-2.5">
              {["🧑‍💻", "👩‍🎨", "👨‍🏫", "👩‍🔬", "🧑‍🎤"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-secondary border-[2.5px] border-background flex items-center justify-center text-base shadow-elevated"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold text-foreground">2,400+</span>
              <span className="text-muted-foreground"> learners this week</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Decorative ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[380px] h-[380px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary/10" />
            <div className="absolute w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] rounded-full border border-primary/5" />
          </div>

          <div className="relative animate-float">
            <img
              src={heroImg}
              alt="People exchanging skills and learning together"
              className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
            />
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute top-8 right-0 lg:right-4 glass-card rounded-2xl px-4 py-3 shadow-raised border border-border"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">🎯</div>
              <div>
                <p className="text-xs font-bold">95% Match</p>
                <p className="text-[10px] text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute bottom-12 left-0 lg:left-4 glass-card rounded-2xl px-4 py-3 shadow-raised border border-border"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">⚡</div>
              <div>
                <p className="text-xs font-bold">Instant Match</p>
                <p className="text-[10px] text-muted-foreground">Find partners in seconds</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-20 lg:mt-28 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border rounded-2xl border border-border bg-card p-6 md:p-0 shadow-elevated"
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center md:py-8 gap-1">
            <span className="text-2xl lg:text-3xl font-extrabold text-gradient">{s.value}</span>
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
    <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
  </section>
  );
};

export default HeroSection;
