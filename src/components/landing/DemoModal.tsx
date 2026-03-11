import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, UserPlus, ListChecks, Handshake, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up in seconds with email or Google. Add your name, bio, and experience level to get started.",
    visual: "👤",
  },
  {
    icon: ListChecks,
    title: "Add Your Skills",
    description: "Tell us what you can teach and what you want to learn. Create custom skills if yours isn't listed.",
    visual: "🎯",
  },
  {
    icon: Handshake,
    title: "Get Matched by AI",
    description: "Our AI analyzes skill compatibility and finds you the perfect learning partners automatically.",
    visual: "🤖",
  },
  {
    icon: CalendarCheck,
    title: "Start Learning",
    description: "Book sessions, exchange skills with peers for free, or hire professional tutors from the marketplace.",
    visual: "🚀",
  },
];

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const DemoModal = ({ open, onClose }: DemoModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-overlay overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="flex gap-1.5 px-6 pt-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= currentStep ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>

            <div className="p-6 pt-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto mb-6 text-4xl">
                    {steps[currentStep].visual}
                  </div>

                  <div className="text-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-center mb-3 tracking-tight">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-sm mx-auto">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prev}
                  disabled={currentStep === 0}
                  className="opacity-70"
                >
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button variant="hero" size="sm" onClick={next}>
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Link to="/auth" onClick={onClose}>
                    <Button variant="hero" size="sm">
                      Get Started Free <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
