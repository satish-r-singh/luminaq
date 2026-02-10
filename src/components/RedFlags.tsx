import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, Minus } from 'lucide-react';

interface FlagProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
}

const FlagItem = ({ id, title, subtitle, description, isOpen, onClick }: FlagProps) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-expanded={isOpen}
        aria-controls={`flag-content-${id}`}
        className="w-full flex items-center justify-between py-8 text-left group"
      >
        <div className="flex flex-col gap-2">
          <span className={`text-xs uppercase tracking-widest transition-colors ${isOpen ? 'text-luminaq-accent' : 'text-luminaq-muted'}`}>
            {subtitle}
          </span>
          <h3 className="text-2xl font-serif text-white group-hover:text-luminaq-accent transition-colors">
            {title}
          </h3>
        </div>
        <div
          className={`transition-all duration-300 ${isOpen ? 'text-luminaq-accent' : 'text-luminaq-muted group-hover:text-white'}`}
          aria-hidden="true"
        >
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`flag-content-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
            role="region"
            aria-labelledby={`flag-header-${id}`}
          >
            <p className="pb-8 text-luminaq-muted leading-relaxed max-w-3xl font-light">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const flags = [
  {
    id: 'wrapper',
    subtitle: "The Wrapper Problem",
    title: "Wrapper vs. Moat",
    description: "90% of current 'AI Startups' are thin wrappers around OpenAI or Anthropic APIs. Once the major models update, their entire value proposition evaporates. We identify if there is any proprietary technology or defensible IP actually owned by the company."
  },
  {
    id: 'data',
    subtitle: "Data Hygiene",
    title: "Dirty Data & Leakage",
    description: "We often find training sets contaminated with test data (looking impressive but failing in production) or PII/Copyrighted material that creates massive liability. We audit the data lineage from ingestion to inference."
  },
  {
    id: 'debt',
    subtitle: "Technical Debt",
    title: "The Demo-Ware Trap",
    description: "The prototype works great for a 5-minute pitch. But the backend is a mess of hardcoded scripts, unscalable databases, and zero security. We check if the code is production-ready or needs a total rewrite."
  },
  {
    id: 'cost',
    subtitle: "Cost Structure",
    title: "Upside-Down Unit Economics",
    description: "Startups often subsidize inference costs to show growth. We calculate the true cost per query and project margins at scale. If they lose money on every API call, scaling leads to bankruptcy, not profitability."
  }
];

export const RedFlags = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="red-flags" className="py-24 bg-luminaq-bg">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16">

          <div className="w-full md:w-1/3">
            <div className="sticky top-12">
              <div className="inline-flex items-center gap-2 text-luminaq-accent mb-6">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest">Risk Assessment</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                Common <br /> Red Flags
              </h2>
              <p className="text-luminaq-muted text-lg mb-8 font-light">
                We've killed deals that looked perfect on paper. Here are the most frequent deal-breakers we uncover in the code.
              </p>
              <a
                href="/case-study.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-black/30 backdrop-blur-sm border border-white/30 hover:border-white hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all inline-block rounded-full"
              >
                Download Case Study
              </a>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <div className="border-t border-white/10" role="tablist" aria-label="Red flag categories">
              {flags.map((flag, index) => (
                <FlagItem
                  key={flag.id}
                  {...flag}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};