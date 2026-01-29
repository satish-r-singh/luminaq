import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { useMemo, useRef } from 'react';

// Code symbols that float upward
const CODE_SYMBOLS = ['<>', '{}', '//', '01', '&&', '||', '==', '=>', '[]', '()', '/*', '*/', ';;'];

// Floating code symbol component
const FloatingSymbol = ({ symbol, delay, duration, startX, startY, fontSize, color }: {
  symbol: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  fontSize: number;
  color: string;
}) => {
  return (
    <motion.span
      className="absolute pointer-events-none font-mono select-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        fontSize: `${fontSize}px`,
        color,
        textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
      }}
      initial={{ opacity: 0, x: 0, y: 0, rotate: -10 }}
      animate={{
        opacity: [0, 0.7, 0.6, 0.7, 0.6, 0],
        x: [0, 500, 1000, 1500, 2000, 2500],
        y: [0, -20, 10, -15, 20, -10],
        rotate: [-10, 5, -5, 10, -8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {symbol}
    </motion.span>
  );
};

// Generate floating symbols data
const generateSymbols = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const colors = [
      'rgba(255, 220, 150, 0.6)', // Warm golden
      'rgba(200, 180, 255, 0.5)', // Soft purple
      'rgba(150, 200, 255, 0.5)', // Soft blue
      'rgba(255, 180, 180, 0.5)', // Soft pink
    ];
    return {
      id: i,
      symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10, // 15-25 seconds to drift across
      startX: -10 - Math.random() * 10, // Start from left side (off-screen)
      startY: 15 + Math.random() * 70, // Distributed vertically
      fontSize: 14 + Math.random() * 16, // 14-30px
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
};

export const Hero = () => {
  const floatingSymbols = useMemo(() => generateSymbols(20), []);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Move background slower than scroll (parallax effect)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background Image - Enchanted Landscape with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      {/* Floating Code Symbols Layer */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {floatingSymbols.map((symbolData) => (
          <FloatingSymbol key={symbolData.id} {...symbolData} />
        ))}
      </div>

      {/* Vignette Effect - Rectangular Edge Style like micro1 */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Left edge fade */}
        <div
          className="absolute inset-y-0 left-0 w-1/3"
          style={{
            background: 'linear-gradient(to right, rgba(8, 8, 8, 0.85) 0%, rgba(8, 8, 8, 0.4) 40%, transparent 100%)',
          }}
        />

        {/* Right edge fade */}
        <div
          className="absolute inset-y-0 right-0 w-1/3"
          style={{
            background: 'linear-gradient(to left, rgba(8, 8, 8, 0.85) 0%, rgba(8, 8, 8, 0.4) 40%, transparent 100%)',
          }}
        />

        {/* Top edge fade */}
        <div
          className="absolute inset-x-0 top-0 h-1/4"
          style={{
            background: 'linear-gradient(to bottom, rgba(8, 8, 8, 0.7) 0%, rgba(8, 8, 8, 0.3) 50%, transparent 100%)',
          }}
        />

        {/* Bottom edge fade - stronger for page transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, #080808 0%, rgba(8, 8, 8, 0.9) 30%, rgba(8, 8, 8, 0.5) 60%, transparent 100%)',
          }}
        />

        {/* Corner reinforcement */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at center, transparent 50%, rgba(8, 8, 8, 0.3) 100%)',
          }}
        />

        {/* Subtle warm tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at center 40%, rgba(180, 140, 100, 0.06) 0%, rgba(80, 50, 80, 0.08) 100%)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-6 pt-24 pb-16">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-20 tracking-tight drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
        >
          The Pitch Deck Says <span className="italic">Unicorn.</span><br />
          The Code Says <span className="text-black italic">Weekend Project.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-white/80 max-w-3xl font-light mb-20 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]"
        >
          Technical Due Diligence for Angel Investors Evaluating AI Startups. <br />
          We strip away the marketing hype and audit the engineering reality.<br />
          So you invest in <span className="font-serif text-white font-medium">INNOVATION</span>, not <span className="font-serif italic text-black font-medium line-through">VAPORWARE</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Buttons Row - Aligned */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://calendly.com/satish-r-singh"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-luminaq-accent hover:bg-luminaq-accentHover text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_4px_30px_rgba(161,131,93,0.4)] hover:shadow-[0_6px_40px_rgba(161,131,93,0.6)]"
            >
              Book a Discovery Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>

            <a
              href="/sample-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-black/30 backdrop-blur-sm border border-white/30 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              <FileText className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" aria-hidden="true" />
              View Sample Report
            </a>
          </div>

          {/* Subtext - Below both buttons */}
          <span className="text-white/60 text-sm font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            15 minutes. No obligation.
          </span>
        </motion.div>

      </div>

      {/* Bottom Fade - Stronger for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-luminaq-bg via-luminaq-bg/80 to-transparent z-10" />
    </section>
  );
};