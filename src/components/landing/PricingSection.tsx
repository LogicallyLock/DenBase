import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Crown } from "lucide-react";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Everything you need to get started with skill exchange.",
    features: [
      "Create your profile",
      "Browse skills",
      "5 messages per day",
      "1 skill swap per week",
      "Community access",
    ],
    cta: "Get Started Free",
    featured: false,
    planId: "free",
    amount: 0,
  },
  {
    name: "Student Plus",
    price: "₹99",
    period: "/month",
    desc: "Unlock unlimited potential for serious learners and teachers.",
    features: [
      "Unlimited skill swaps",
      "Unlimited messages",
      "AI skill match suggestions",
      "Premium tutors list",
      "Basic skill certificates",
    ],
    cta: "Start Student Plus",
    featured: true,
    planId: "student_plus",
    amount: 9900, // in paise
  },
  {
    name: "Pro Learner",
    price: "₹299",
    period: "/month",
    desc: "The complete Denbase experience with exclusive perks.",
    features: [
      "Everything in Plus",
      "AI learning roadmap",
      "Priority tutor booking",
      "Recorded sessions access",
      "Resume skill badge",
    ],
    cta: "Go Pro",
    featured: false,
    planId: "pro_learner",
    amount: 29900, // in paise
  },
];

const PricingSection = () => {
  const { checkout, loading } = useRazorpay();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if (plan.amount === 0) {
      navigate("/auth");
      return;
    }
    if (!user) {
      navigate("/auth");
      return;
    }
    checkout(plan.planId, plan.amount, plan.name);
  };

  return (
    <section id="pricing" className="py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/40 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em]">
            Start free, scale as{" "}
            <span className="text-gradient">you grow</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            No hidden fees. No surprises. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl border p-8 flex flex-col relative ${
                p.featured
                  ? "border-primary/30 bg-card shadow-overlay glow-primary md:-mt-4 md:mb-0 md:pb-12"
                  : "border-border bg-card shadow-elevated"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-hero-gradient px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                    <Zap className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {p.name}
                  {p.planId === "pro_learner" && <Crown className="w-4 h-4 text-primary" />}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{p.period}</span>
              </div>

              <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${p.featured ? "bg-primary/15" : "bg-secondary"}`}>
                      <Check className={`w-3 h-3 ${p.featured ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={p.featured ? "hero" : "outline"}
                size="lg"
                className="w-full"
                onClick={() => handlePlanSelect(p)}
                disabled={loading}
              >
                {p.cta} {p.featured && <ArrowRight className="w-4 h-4" />}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Tutor Commission Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="text-xl font-bold mb-2">🎓 Are you a Tutor?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Set your own session price from <strong>₹300 – ₹3,000</strong>. We only take a{" "}
              <strong className="text-primary">5% platform fee</strong>. You earn ₹950 on a ₹1,000 session.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
