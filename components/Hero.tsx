import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col px-6 pt-6 overflow-hidden bg-[#0a0a0a]">
      
      {/* Background: Solid Matte Black with Technical Wireframe */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        {/* Grid Pattern - Increased visibility */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Vignette/Gradient to soften edges and focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_90%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-8 tracking-tight"
        >
          The Pitch Deck Says <span className="italic">Unicorn.</span><br/>
          The Code Says <span className="text-white/40 italic">Weekend Project.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl font-light mb-12"
        >
          Technical Due Diligence for UAE Investors. We strip away the marketing hype and audit the engineering reality.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            className="group flex items-center gap-3 bg-luminaq-accent hover:bg-luminaq-accentHover text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
          >
            Request Audit Proposal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            className="group flex items-center gap-3 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
          >
            <FileText className="w-4 h-4 text-luminaq-muted group-hover:text-white transition-colors" />
            View Sample Report
          </button>
        </motion.div>

      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10" />
    </section>
  );
};