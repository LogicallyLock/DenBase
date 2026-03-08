import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Users, Target, Heart, Zap } from "lucide-react";

const values = [
  { icon: Users, title: "Community First", desc: "We believe the best learning happens when people teach each other." },
  { icon: Target, title: "Purpose-Driven", desc: "Every feature we build serves one goal: making skill exchange effortless." },
  { icon: Heart, title: "Inclusive by Design", desc: "Denbase is for everyone — regardless of background, location, or experience." },
  { icon: Zap, title: "Continuous Growth", desc: "We're lifelong learners ourselves, always iterating and improving." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <SEO title="About" description="Learn about Denbase — the peer-to-peer learning platform connecting learners and tutors worldwide." canonical="/about" />
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">About Denbase</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Denbase is a peer-to-peer learning platform that connects people who want to teach with those who want to learn. 
            Our AI-powered matching system finds your perfect learning partner, enabling meaningful skill exchanges across the globe.
          </p>

          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-12">
            To democratize education by making knowledge exchange accessible, engaging, and rewarding for everyone. 
            We envision a world where anyone can learn anything from the people around them.
          </p>

          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <v.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Denbase started with a simple idea: what if everyone could be both a teacher and a student? 
            Founded in 2025, we've grown from a small community of skill swappers into a thriving platform 
            connecting learners and tutors worldwide. Our team is passionate about education, technology, 
            and building tools that bring people together.
          </p>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
