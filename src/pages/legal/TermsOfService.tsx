import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Terms of Service" description="Read the terms and conditions for using the Denbase platform." canonical="/terms" />
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Denbase, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

        <h2>2. User Accounts</h2>
        <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

        <h2>3. Acceptable Use</h2>
        <p>You agree to use Denbase only for lawful purposes. You may not use the platform to harass others, share inappropriate content, or engage in fraudulent activities.</p>

        <h2>4. Skill Exchange & Sessions</h2>
        <p>Denbase facilitates connections between users for skill exchange. We are not responsible for the quality of instruction or outcomes of sessions. Paid tutoring sessions are subject to our payment and refund policies.</p>

        <h2>5. Intellectual Property</h2>
        <p>Content you create and share on Denbase remains yours. By posting content, you grant Denbase a license to display it on the platform. Denbase's branding, design, and software are our intellectual property.</p>

        <h2>6. Termination</h2>
        <p>We may suspend or terminate your account if you violate these terms. You may delete your account at any time through your account settings.</p>

        <h2>7. Limitation of Liability</h2>
        <p>Denbase is provided "as is." We make no warranties regarding availability or fitness for a particular purpose. Our liability is limited to the fees you've paid us in the past 12 months.</p>

        <h2>8. Contact</h2>
        <p>Questions about these terms? Contact us at legal@denbase.com.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
