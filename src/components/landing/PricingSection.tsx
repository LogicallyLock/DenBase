import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started",
    features: ["Create profile", "Skill exchange matching", "5 matches/month", "Basic messaging"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For serious learners",
    features: ["Unlimited matches", "Advanced search filters", "Priority profile visibility", "Session scheduling tools"],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    desc: "The complete experience",
    features: ["AI learning roadmap", "Unlimited sessions", "Profile boost", "Skill certification badge"],
    cta: "Go Premium",
    featured: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-sm font-semibold text-primary">Pricing</span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Simple, transparent <span className="text-gradient">pricing</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start free, upgrade when you're ready. Cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`rounded-2xl border p-8 flex flex-col ${
              p.featured
                ? "border-primary glow-primary bg-card relative"
                : "border-border bg-card"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-hero-gradient px-4 py-1 text-xs font-bold text-primary-foreground">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            <div className="mt-6 mb-6">
              <span className="text-4xl font-extrabold">{p.price}</span>
              <span className="text-muted-foreground text-sm">{p.period}</span>
            </div>
            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={p.featured ? "hero" : "outline"} size="lg" className="w-full">
              {p.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
