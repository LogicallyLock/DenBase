import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border relative">
    <div className="container mx-auto px-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight mb-4">
            <img src="/logo.png" alt="Denbase logo" className="w-8 h-8 rounded-lg object-contain" />
            <span>
              <span className="text-gradient">Den</span>base
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            The future of peer learning. Exchange skills, connect with tutors, and grow your expertise alongside a global community.
          </p>
          <div className="flex gap-4 mt-6">
            {["𝕏", "in", "▶"].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary/10 flex items-center justify-center text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Marketplace", href: "#marketplace" }, { label: "Blog", to: "/blog" }] },
          { title: "Company", links: [{ label: "About", to: "/about" }, { label: "Careers", to: "/careers" }, { label: "Blog", to: "/blog" }] },
          { title: "Legal", links: [{ label: "Privacy Policy", to: "/privacy" }, { label: "Terms of Service", to: "/terms" }, { label: "Cookie Policy", to: "/cookies" }, { label: "GDPR", to: "/gdpr" }] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-4 tracking-tight">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((l: any) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Denbase. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with ❤️ for learners everywhere
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
