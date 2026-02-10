import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldAlert,
  UserCheck,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  X,
  Package,
  DollarSign,
  Users
} from 'lucide-react';

interface NavbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { icon: <Home className="w-4 h-4" />, label: "Home", href: "#" },
  { icon: <Users className="w-4 h-4" />, label: "Who We Help", href: "#who-we-help" },
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "What We Audit", href: "#audit" },
  { icon: <Package className="w-4 h-4" />, label: "Deliverables", href: "#deliverables" },
  { icon: <UserCheck className="w-4 h-4" />, label: "The Auditor", href: "#auditor" },
  { icon: <ShieldAlert className="w-4 h-4" />, label: "Red Flags", href: "#red-flags" },
  { icon: <DollarSign className="w-4 h-4" />, label: "Pricing", href: "#pricing" }
];

const Logo = () => (
  <img
    src="/logo.webp"
    alt="LuminaQ Logo"
    className="w-6 h-6 shrink-0"
  />
);

// Mobile Navigation
const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-lg font-bold tracking-tight text-white">LUMINAQ</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/80 z-40"
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-72 bg-luminaq-surface border-l border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Logo />
                  <span className="text-lg font-bold tracking-tight text-white">LUMINAQ</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-luminaq-muted hover:text-white rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center gap-4 px-4 py-3 text-luminaq-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-white/10 space-y-4">
                <a
                  href="https://calendly.com/satish-r-singh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-white/20 text-white font-medium rounded-lg py-3 hover:border-white hover:bg-white/5 transition-all text-sm uppercase tracking-wide"
                >
                  <FileText size={16} />
                  Request Audit
                </a>
                <button
                  className="w-full flex items-center justify-center gap-2 text-luminaq-muted hover:text-white transition-colors py-2 text-sm"
                >
                  <LogOut size={16} />
                  Client Login
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="md:hidden h-16" />
    </>
  );
};

// Desktop Sidebar Navigation
const DesktopNav: React.FC<NavbarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <nav
      className={`hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 bg-black border-r border-white/5 z-50 py-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20 px-4' : 'w-64 px-6'
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-10 bg-luminaq-card border border-white/10 text-white rounded-full p-1.5 hover:bg-luminaq-accent hover:border-luminaq-accent transition-all z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Top Section */}
      <div>
        <div className={`flex items-center gap-3 mb-12 ${isCollapsed ? 'justify-center' : ''} h-8`}>
          <Logo />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold tracking-tight text-white font-sans overflow-hidden whitespace-nowrap"
              >
                LUMINAQ
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 py-3 text-sm text-luminaq-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative ${isCollapsed ? 'justify-center px-2' : 'px-4'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-6">
        <div>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold tracking-[0.2em] text-luminaq-muted uppercase mb-4 pl-4 whitespace-nowrap"
            >
              Client Portal
            </motion.p>
          )}

          <a
            href="https://calendly.com/satish-r-singh"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/30 hover:border-white hover:bg-white/10 text-white font-medium transition-all overflow-hidden ${isCollapsed ? 'p-3 aspect-square rounded-lg' : 'py-3 px-4 text-xs uppercase tracking-wide rounded-full'
              }`}
            title={isCollapsed ? "Request Audit" : undefined}
            aria-label="Request Audit"
          >
            {isCollapsed ? <FileText size={18} /> : <span className="whitespace-nowrap">Request Audit</span>}
          </a>
        </div>

        <button
          className={`flex items-center gap-3 text-xs text-luminaq-muted hover:text-white transition-colors w-full ${isCollapsed ? 'justify-center px-0' : 'px-4'
            }`}
          title={isCollapsed ? "Client Login" : undefined}
          aria-label="Client Login"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Client Login</span>}
        </button>
      </div>
    </nav>
  );
};

export const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <>
      <MobileNav />
      <DesktopNav {...props} />
    </>
  );
};