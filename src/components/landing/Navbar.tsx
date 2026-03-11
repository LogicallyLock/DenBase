import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-elevated" : ""
      }`}
    >
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <img src="/logo.png" alt="Denbase logo" className="w-8 h-8 rounded-lg object-contain" />
          <span>
            <span className="text-gradient">Den</span>
            <span className="text-foreground">base</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth"><Button variant="ghost" size="default">Log In</Button></Link>
          <Link to="/auth"><Button variant="hero" size="default">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button></Link>
        </div>

        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary/80 transition-colors text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-border overflow-hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 p-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-3 mt-2 border-t border-border">
                <ThemeToggle />
                <Link to="/auth" className="flex-1"><Button variant="ghost" size="default" className="w-full" onClick={() => setMobileOpen(false)}>Log In</Button></Link>
                <Link to="/auth" className="flex-1"><Button variant="hero" size="default" className="w-full" onClick={() => setMobileOpen(false)}>Get Started</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
