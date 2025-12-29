import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldAlert, UserCheck, Home, LogOut, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface NavbarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <nav 
      className={`hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 bg-black border-r border-white/5 z-50 py-8 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20 px-4' : 'w-64 px-6'
      }`}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-10 bg-luminaq-card border border-white/10 text-white rounded-full p-1.5 hover:bg-luminaq-accent hover:border-luminaq-accent transition-all z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Top Section */}
      <div>
        <div className={`flex items-center gap-3 mb-12 ${isCollapsed ? 'justify-center' : ''} h-8`}>
          {/* Custom Two-Lobed Spirograph Logo */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white shrink-0"
          >
            <path d="M12 12c0-3-2.5-5-4.5-5S3 9 3 12s2.5 5 4.5 5s4.5-2 4.5-5" className="opacity-80" />
            <path d="M12 12c0-3 2.5-5 4.5-5s4.5 2 4.5 5s-2.5 5-4.5 5s-4.5-2-4.5-5" className="opacity-80" />
            <circle cx="12" cy="12" r="1" fill="currentColor" className="text-luminaq-accent" />
          </svg>

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
          {[
            { icon: <Home className="w-4 h-4" />, label: "Home", href: "#" },
            { icon: <LayoutDashboard className="w-4 h-4" />, label: "Audit Scope", href: "#audit" },
            { icon: <UserCheck className="w-4 h-4" />, label: "The Auditor", href: "#auditor" },
            { icon: <ShieldAlert className="w-4 h-4" />, label: "Red Flags", href: "#red-flags" }
          ].map((item, idx) => (
            <a 
              key={idx} 
              href={item.href} 
              className={`flex items-center gap-3 py-3 text-sm text-luminaq-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative ${
                isCollapsed ? 'justify-center px-2' : 'px-4'
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
          
          <button 
            className={`w-full flex items-center justify-center border border-white/20 text-white font-medium rounded-lg hover:border-white hover:bg-white/5 transition-all overflow-hidden ${
              isCollapsed ? 'p-3 aspect-square' : 'py-3 px-4 text-xs uppercase tracking-wide'
            }`}
            title={isCollapsed ? "Request Audit" : undefined}
          >
            {isCollapsed ? <FileText size={18} /> : <span className="whitespace-nowrap">Request Audit</span>}
          </button>
        </div>
        
        <button 
          className={`flex items-center gap-3 text-xs text-luminaq-muted hover:text-white transition-colors w-full ${
             isCollapsed ? 'justify-center px-0' : 'px-4'
          }`}
          title={isCollapsed ? "Client Login" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Client Login</span>}
        </button>
      </div>
    </nav>
  );
};