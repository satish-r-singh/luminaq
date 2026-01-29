import { useState } from 'react';
import { Hero } from './components/Hero';
import { Opening } from './components/Opening';
import { WhoWeHelp } from './components/WhoWeHelp';
import { TrustGrid } from './components/TrustGrid';
import { Deliverables } from './components/Deliverables';
import { TheAuditor } from './components/TheAuditor';
import { Proof } from './components/Proof';
import { RedFlags } from './components/RedFlags';
import { Pricing } from './components/Pricing';
import { FreeResource } from './components/FreeResource';
import { TrustBadges } from './components/TrustBadges';
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
        className={`flex-1 flex flex-col gap-0 relative w-full transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
          }`}
      >
        <Hero />
        <Opening />
        <WhoWeHelp />
        <TrustGrid />
        <Deliverables />
        <TheAuditor />
        <Proof />
        <RedFlags />
        <Pricing />
        <FreeResource />
        <TrustBadges />
        <Footer />
      </main>
    </div>
  );
}