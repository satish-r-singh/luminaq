import React from 'react';
import { Terminal, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="text-white w-6 h-6" />
              <span className="text-xl font-bold tracking-tight text-white">LUMINAQ</span>
            </div>
            <p className="text-luminaq-muted max-w-sm mb-6 font-light">
              Technical Due Diligence for the modern AI investor. We protect capital from vaporware and technical debt.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-luminaq-muted hover:text-white hover:border-white transition-all rounded-full">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-luminaq-muted hover:text-white hover:border-white transition-all rounded-full">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 text-luminaq-muted hover:text-white hover:border-white transition-all rounded-full">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-luminaq-muted text-sm font-light">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-luminaq-muted text-sm font-light">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NDAs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-luminaq-muted text-xs">
            &copy; {new Date().getFullYear()} Luminaq Intelligence Ltd.
          </p>
          <p className="text-luminaq-muted text-xs uppercase tracking-widest">
            Abu Dhabi • Dubai • London
          </p>
        </div>
      </div>
    </footer>
  );
};