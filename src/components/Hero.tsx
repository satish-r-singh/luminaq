import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { useMemo, useRef, type ReactNode } from 'react';

// ---------------------------------------------------------------- hero exit
// The hero stands down one element at a time rather than sliding away as a
// block. Each layer owns its own window of the hero's scroll-away, so the
// frame empties in sequence and the departure reads as authored.
//
// See docs/kage-design-philosophy.md §6. Two deliberate departures from the
// reference:
//
// 1. It dissolves its largest element with a blur. This project's performance
//    rules restrict scroll-driven animation to transform and opacity, so that
//    becomes a slight scale recede — same "letting go" read, stays on the
//    compositor.
// 2. Its hero pins the furniture to the foot of the frame, so that furniture
//    can fade long before it scrolls off. Ours is centred: all four blocks sit
//    together and the headline clears the top edge first. Windows are
//    therefore ordered by when each block actually leaves the frame, so every
//    fade is seen rather than completing off-screen. It also leaves the call
//    to action standing last, which is the right order for this page.
//
// `clears` records the scrollYProgress at which each block passes the top of
// the viewport, measured at 1440x900 (the tightest case — every block stays in
// frame longer on narrow screens). Each window must finish before its `clears`.

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

type ExitSpec = {
  from: number;    // scrollYProgress at which this layer starts to go
  to: number;      // ...and at which it has gone
  shift?: number;  // px it drifts down on the way out
  recede?: number; // fraction it scales away by
};

// Ordered by when each layer releases, not by DOM position.
const HERO_EXIT = {
  //                                                        clears frame at
  ambience:    { from: 0.0,  to: 0.22 },                 // full-bleed
  headline:    { from: 0.02, to: 0.36, shift: 10, recede: 0.02 }, // 0.42
  standfirst:  { from: 0.14, to: 0.52, shift: 15 },      // 0.58
  reassurance: { from: 0.22, to: 0.62, shift: 15 },      // 0.77
  actions:     { from: 0.28, to: 0.68, shift: 15 },      // 0.73
} satisfies Record<string, ExitSpec>;

const ExitLayer = ({
  progress,
  spec,
  className,
  children,
}: {
  progress: MotionValue<number>;
  spec: ExitSpec;
  className?: string;
  children: ReactNode;
}) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Tabbing to a link inside a faded layer scrolls it only just inside the
  // viewport edge — which is still deep enough into the exit for it to be
  // invisible. Measured: focus landed on the hero CTA at opacity 0.003. So a
  // layer holding focus overrides its scroll position and shows itself.
  const focusBoost = useMotionValue(0);
  const scrolledAway = useTransform(progress, (p) => 1 - smoothstep(spec.from, spec.to, p));
  const opacity = useTransform([scrolledAway, focusBoost], ([away, focus]: number[]) =>
    Math.max(away, focus)
  );

  const y = useTransform(opacity, (a) => (1 - a) * (spec.shift ?? 0));
  const scale = useTransform(opacity, (a) => 1 - (1 - a) * (spec.recede ?? 0));

  // A faded layer sits in the viewport for part of its window, so stop it
  // catching clicks meant for what is behind it.
  useMotionValueEvent(opacity, 'change', (a) => {
    const el = ref.current;
    if (el) el.style.pointerEvents = a < 0.05 ? 'none' : '';
  });

  // Reduced motion keeps the whole hero readable — only the choreography goes.
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y, scale }}
      onFocus={() => focusBoost.set(1)}
      onBlur={() => focusBoost.set(0)}
    >
      {children}
    </motion.div>
  );
};

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
          src="/hero-bg.webp"
          alt=""
          className="w-full h-[120%] object-cover"
        />
      </motion.div>

      {/* Floating Code Symbols Layer — decoration, so it dissolves first */}
      <ExitLayer
        progress={scrollYProgress}
        spec={HERO_EXIT.ambience}
        className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
      >
        {floatingSymbols.map((symbolData) => (
          <FloatingSymbol key={symbolData.id} {...symbolData} />
        ))}
      </ExitLayer>

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

        {/* Largest flat block, and the first to clear the frame: it recedes
            rather than dims, which reads as release instead of a brightness cut */}
        <ExitLayer progress={scrollYProgress} spec={HERO_EXIT.headline} className="mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]"
          >
            The Pitch Deck Says <span className="italic">Unicorn.</span><br />
            The Code Says <span className="text-black italic">Weekend Project.</span>
          </motion.h1>
        </ExitLayer>

        <ExitLayer progress={scrollYProgress} spec={HERO_EXIT.standfirst} className="mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl font-light drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]"
          >
            We protect your capital from AI startups that aren't real.<br />
            Technical due diligence for Angel Investors.
          </motion.p>
        </ExitLayer>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Buttons Row - Aligned. Last to release: it is the page's purpose. */}
          <ExitLayer
            progress={scrollYProgress}
            spec={HERO_EXIT.actions}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
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
          </ExitLayer>

          {/* Subtext - Below both buttons. Releases just ahead of them. */}
          <ExitLayer progress={scrollYProgress} spec={HERO_EXIT.reassurance}>
            <span className="text-white/60 text-sm font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              15 minutes. No obligation.
            </span>
          </ExitLayer>
        </motion.div>

      </div>

      {/* Bottom Fade - Stronger for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-luminaq-bg via-luminaq-bg/80 to-transparent z-10" />
    </section>
  );
};