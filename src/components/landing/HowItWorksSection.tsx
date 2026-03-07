import { motion } from "framer-motion";
import { UserPlus, ListChecks, Handshake, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  { icon: UserPlus, step: 1, title: "Create Your Profile", desc: "Sign up in 30 seconds. Tell us about your skills, goals, and availability." },
  { icon: ListChecks, step: 2, title: "Add Your Skills", desc: "List what you can teach and what you want to learn. Our AI handles the rest." },
  { icon: Handshake, step: 3, title: "Get Matched", desc: "Receive curated matches with compatible learners or browse professional tutors." },
  { icon: CalendarCheck, step: 4, title: "Start Learning", desc: "Book sessions, join video calls, exchange knowledge, and track your progress." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-28 lg:py-36 relative overflow-hidden">
    <div className="absolute inset-0 bg-secondary/40 pointer-events-none" />
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

    <div className="container mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          How It Works
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em]">
          Start learning in{" "}
          <span className="text-gradient">4 simple steps</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          From signup to your first session in under 5 minutes.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connector line */}
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px]">
          <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
        </div>

        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative z-10 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-raised flex items-center justify-center">
                <s.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">{s.step}</span>
              </div>
            </div>
            <h3 className="text-base font-bold mb-2 tracking-tight">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
