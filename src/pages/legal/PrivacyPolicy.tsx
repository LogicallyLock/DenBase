import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Privacy Policy" description="How Denbase collects, uses, and protects your personal data." canonical="/privacy" />
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email address, profile information, and skills. We also collect usage data automatically, including log data and device information.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide and improve Denbase, match you with learning partners, facilitate communication, and send important updates about your account.</p>

        <h2>3. Information Sharing</h2>
        <p>We do not sell your personal information. We share your profile information with other users only as necessary for skill matching and sessions. We may share data with service providers who assist in operating our platform.</p>

        <h2>4. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data, including encryption in transit and at rest, secure authentication, and regular security audits.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal data at any time through your account settings. You may also contact us to exercise your data rights.</p>

        <h2>6. Cookies</h2>
        <p>We use essential cookies to maintain your session and preferences. See our Cookie Policy for more details.</p>

        <h2>7. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@denbase.com.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
