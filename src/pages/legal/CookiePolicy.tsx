import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";

const CookiePolicy = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Cookie Policy" description="Learn about the cookies Denbase uses and how to manage them." canonical="/cookies" />
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>

        <h2>Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>Required for the platform to function. These include session cookies and authentication tokens. Cannot be disabled.</p>

        <h3>Preference Cookies</h3>
        <p>Remember your settings like theme preference (light/dark mode) and language selection.</p>

        <h3>Analytics Cookies</h3>
        <p>Help us understand how users interact with Denbase so we can improve the experience. Data is anonymized.</p>

        <h2>Managing Cookies</h2>
        <p>You can control cookies through your browser settings. Note that disabling essential cookies may prevent the platform from functioning properly.</p>

        <h2>Contact</h2>
        <p>Questions? Contact us at privacy@denbase.com.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
