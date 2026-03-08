import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-28 lg:py-36 relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-gradient opacity-[0.03] pointer-events-none" />
    <div className="container mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] leading-tight">
          Ready to start your{" "}
          <span className="text-gradient">learning journey</span>?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Join thousands of learners exchanging skills and growing together. Your next breakthrough is one swap away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link to="/auth">
            <Button variant="hero" size="xl">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="xl">
              Talk to Sales
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          No credit card required · Free forever plan available · Cancel anytime
        </p>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
