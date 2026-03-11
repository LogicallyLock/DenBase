import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEO from "@/components/SEO";

const GDPR = () => (
  <div className="min-h-screen bg-background">
    <SEO title="GDPR Compliance" description="Your data rights under GDPR and how Denbase protects your information." canonical="/gdpr" />
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl prose dark:prose-invert">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">GDPR Compliance</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

        <h2>Your Rights Under GDPR</h2>
        <p>If you are located in the European Economic Area (EEA), you have the following rights:</p>
        <ul>
          <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
          <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Right to Object:</strong> Object to the processing of your personal data.</li>
          <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
        </ul>

        <h2>Legal Basis for Processing</h2>
        <p>We process your data based on: your consent, performance of a contract (providing the Denbase service), legitimate interests (improving our platform), and legal obligations.</p>

        <h2>Data Transfers</h2>
        <p>Your data may be transferred outside the EEA. We ensure adequate protection through Standard Contractual Clauses and other safeguards.</p>

        <h2>Data Protection Officer</h2>
        <p>For GDPR-related inquiries, contact our Data Protection Officer at dpo@denbase.com.</p>

        <h2>Supervisory Authority</h2>
        <p>You have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default GDPR;
