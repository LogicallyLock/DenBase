const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <span className="text-lg font-extrabold">
            <span className="text-gradient">Skill</span>Swap
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            Learn anything by teaching what you know. The future of peer learning.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Marketplace", "Dashboard"] },
          { title: "Company", links: ["About", "Contact", "Careers", "Blog"] },
          { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
