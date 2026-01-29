import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const storyBlocks = [
    "You're in the pitch meeting. The founder says \"fine-tuned LLM with proprietary embeddings.\"You nod. You smile. You have no idea if that's impressive or meaningless.",
    "The demo looks incredible. The team seems smart. The market opportunity sounds massive. But something feels off—and you can't explain why.",
    "You leave with a beautiful deck and a simple question you can't answer: Is this real innovation, or an expensive science project?",
    "Large VCs have CTOs on speed dial to answer that question. You have Google and a gut feeling.",
    "That's not due diligence. That's hope with a checkbook."
];

// Grid wave component - creates a particle grid effect
const GridWave = () => (
    <div className="absolute bottom-0 left-0 right-0 h-56 overflow-hidden pointer-events-none z-30">
        {/* Top gradient to blend text into the wave */}
        <div
            className="absolute top-0 left-0 right-0 h-24"
            style={{
                background: 'linear-gradient(to bottom, transparent 0%, #080808 100%)'
            }}
        />
        <svg
            viewBox="0 0 1200 200"
            className="w-full h-full"
            preserveAspectRatio="xMidYMax slice"
        >
            <defs>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                </linearGradient>
            </defs>
            {/* Background fill to hide text behind */}
            <rect x="0" y="70" width="1200" height="130" fill="#080808" />
            {/* Horizontal grid lines */}
            {[...Array(15)].map((_, i) => (
                <motion.path
                    key={`h-${i}`}
                    d={`M 0 ${100 + i * 8} Q 300 ${80 + i * 8 + Math.sin(i * 0.5) * 20} 600 ${100 + i * 8} T 1200 ${100 + i * 8}`}
                    stroke="url(#gridGradient)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                />
            ))}
            {/* Vertical grid lines with wave */}
            {[...Array(40)].map((_, i) => (
                <motion.line
                    key={`v-${i}`}
                    x1={i * 30}
                    y1={80}
                    x2={i * 30}
                    y2={200}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                />
            ))}
            {/* Glowing dots at intersections */}
            {[...Array(20)].map((_, i) => (
                <motion.circle
                    key={`dot-${i}`}
                    cx={60 + i * 60}
                    cy={120 + Math.sin(i * 0.8) * 15}
                    r="2"
                    fill="rgba(161, 131, 93, 0.8)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        duration: 3,
                        delay: i * 0.15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}
        </svg>
    </div>
);

export const Opening = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Two-phase scroll:
    // Phase 1 (0-50%): Scroll text up until last line reaches center
    // Phase 2 (50-80%): Pause scroll while last line grows
    // After 80%: Section ends, page scrolls naturally to next section
    const yOffset = useTransform(
        scrollYProgress,
        [0, 0.5, 0.8, 1],
        ['28vh', '-40vh', '-40vh', '-40vh']
    );

    // Scale up the last line during the pause phase
    const lastLineScale = useTransform(scrollYProgress, [0.5, 0.7, 0.8], [1, 1.5, 1.5]);
    const lastLineOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0.6, 1]);

    return (
        <section
            ref={containerRef}
            className="relative bg-luminaq-bg"
            style={{ height: '150vh' }}
        >
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Section label - always visible */}
                <div className="absolute top-20 left-0 right-0 text-center z-30">
                    <span className="text-luminaq-accent text-lg font-medium uppercase tracking-widest">
                        The Reality
                    </span>
                </div>

                {/* Strong top fade - hides text above */}
                <div
                    className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
                    style={{
                        height: '30%',
                        background: 'linear-gradient(to bottom, #080808 0%, #080808 40%, transparent 100%)'
                    }}
                />

                {/* Strong bottom fade - hides text below but shows grid */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-5 pointer-events-none"
                    style={{
                        height: '30%',
                        background: 'linear-gradient(to top, #080808 0%, #080808 40%, transparent 100%)'
                    }}
                />

                {/* Scrolling text */}
                <motion.div
                    className="absolute left-0 right-0 px-6"
                    style={{ y: yOffset }}
                >
                    <div className="max-w-2xl mx-auto space-y-32">
                        {storyBlocks.slice(0, -1).map((text, index) => (
                            <p
                                key={index}
                                className={`text-center text-lg md:text-xl leading-relaxed ${index === 5
                                    ? 'text-white italic'
                                    : 'text-luminaq-muted font-light'
                                    }`}
                            >
                                {text}
                            </p>
                        ))}
                        {/* Last line with scaling effect */}
                        <motion.p
                            className="text-center text-lg md:text-xl leading-relaxed text-white font-medium"
                            style={{
                                scale: lastLineScale,
                                opacity: lastLineOpacity
                            }}
                        >
                            {storyBlocks[storyBlocks.length - 1]}
                        </motion.p>
                    </div>
                </motion.div>

                {/* Grid wave visual at bottom */}
                <GridWave />

                {/* Progress indicator */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block z-30">
                    <div className="relative h-24 w-0.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-luminaq-accent rounded-full"
                            style={{
                                height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
