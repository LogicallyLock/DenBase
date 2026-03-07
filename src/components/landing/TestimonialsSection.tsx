import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Sarah K.", role: "UX Designer", text: "SkillSwap helped me learn Python by teaching design. The skill exchange concept is brilliant!", rating: 5 },
  { name: "Marcus T.", role: "Software Engineer", text: "Found an amazing Spanish tutor through the marketplace. The booking experience is seamless.", rating: 5 },
  { name: "Priya R.", role: "Marketing Manager", text: "I've been teaching marketing and learning photography. It's like a knowledge bartering system!", rating: 5 },
];

const TestimonialsSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary">Testimonials</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Loved by <span className="text-gradient">learners worldwide</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
