import { motion } from "framer-motion";
import { UserPlus, ListChecks, Handshake, CalendarCheck } from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Create Your Profile", desc: "Sign up and tell us about your skills, experience, and what you want to learn." },
  { icon: ListChecks, step: "02", title: "Add Your Skills", desc: "List skills you can teach and skills you'd love to learn from others." },
  { icon: Handshake, step: "03", title: "Get Matched", desc: "Our AI matches you with the perfect learning partner or professional tutor." },
  { icon: CalendarCheck, step: "04", title: "Start Learning", desc: "Schedule sessions, exchange knowledge, and grow your expertise." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary">How It Works</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Start learning in <span className="text-gradient">4 simple steps</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <s.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary/60">STEP {s.step}</span>
            <h3 className="text-lg font-bold mt-1 mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
