import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { TrustGrid } from './components/TrustGrid';
import { TheAuditor } from './components/TheAuditor';
import { RedFlags } from './components/RedFlags';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-luminaq-bg font-sans text-luminaq-text flex flex-col md:flex-row">
      <Navbar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main 
        className={`flex-1 flex flex-col gap-0 relative w-full transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Hero />
        <TrustGrid />
        <TheAuditor />
        <RedFlags />
        <Footer />
      </main>
    </div>
  );
}