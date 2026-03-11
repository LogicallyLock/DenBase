import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import MarketplaceSection from "@/components/landing/MarketplaceSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEO
      canonical="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Denbase — Learn by Teaching What You Know",
        description: "Exchange skills with peers or connect with professional tutors. AI-powered matching for the perfect learning partner.",
        url: "https://denbase.lovable.app/",
      }}
    />
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <MarketplaceSection />
    <PricingSection />
    <TestimonialsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
