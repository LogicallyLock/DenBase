import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah Kim", role: "UX Designer at Figma", text: "Denbase completely changed how I learn. I taught UX design and learned Python from an engineer — all for free. The matching algorithm is incredibly accurate.", rating: 5, avatar: "👩‍🎨" },
  { name: "Marcus Thompson", role: "Software Engineer", text: "Found an amazing Spanish tutor through the marketplace. The booking experience is seamless, and the video call quality is excellent. Worth every penny.", rating: 5, avatar: "🧑‍💻" },
  { name: "Priya Ramesh", role: "Marketing Director", text: "I've been teaching digital marketing and learning photography in exchange. It's like a knowledge economy platform — brilliant concept, flawless execution.", rating: 5, avatar: "👩‍💼" },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-28 lg:py-36 relative">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em]">
          Loved by{" "}
          <span className="text-gradient">learners worldwide</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Join thousands of people already learning and growing on Denbase.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-border bg-card p-7 flex flex-col hover:shadow-raised transition-all duration-300"
          >
            <Quote className="w-8 h-8 text-primary/20 mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
              {t.text}
            </p>
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
