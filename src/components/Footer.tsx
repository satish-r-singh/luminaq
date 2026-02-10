import { Github, Linkedin, Twitter } from 'lucide-react';

const Logo = () => (
  <img
    src="/logo.webp"
    alt="LuminaQ Logo"
    className="w-6 h-6"
  />
);

const socialLinks = [
  { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
  { icon: <Twitter size={18} />, label: 'Twitter', href: '#' },
  { icon: <Github size={18} />, label: 'GitHub', href: '#' },
];

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Methodology', href: '#' },
  { label: 'Case Studies', href: '#' },
  { label: 'Careers', href: '#' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'NDAs', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-white">LUMINAQ</span>
            </div>
            <p className="text-luminaq-muted max-w-sm mb-6 font-light">
              Technical Due Diligence for the modern AI investor. We protect capital from vaporware and technical debt.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 text-luminaq-muted hover:text-white hover:border-white transition-all rounded-full"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Company links">
            <h4 className="text-white font-serif text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-luminaq-muted text-sm font-light">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h4 className="text-white font-serif text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-luminaq-muted text-sm font-light">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-luminaq-muted text-xs">
            &copy; {new Date().getFullYear()} Luminaq
          </p>
          <p className="text-luminaq-muted text-xs uppercase tracking-widest">
            Abu Dhabi • Dubai •
          </p>
        </div>
      </div>
    </footer>
  );
};