import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Background glow */}
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

    <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col gap-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary w-fit">
          🚀 The future of peer learning
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
          Learn Anything by{" "}
          <span className="text-gradient">Teaching What You Know</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg">
          Exchange skills with peers for free or connect with professional tutors.
          SkillSwap matches you with the perfect learning partner using AI.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button variant="hero" size="xl">
            Get Started <ArrowRight className="ml-1" />
          </Button>
          <Button variant="hero-outline" size="xl">
            <Search className="mr-1" /> Find Skills
          </Button>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">2,400+</span> learners already joined
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative flex justify-center"
      >
        <div className="animate-float">
          <img
            src={heroImg}
            alt="People exchanging skills and learning together"
            className="w-full max-w-lg drop-shadow-2xl"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
