import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const storyBlocks = [
    "You're in the pitch meeting. The founder says \"fine-tuned LLM with proprietary embeddings.\" You nod. You smile. You have no idea if that's impressive or meaningless. The demo looks incredible. The team seems smart. The market opportunity sounds massive. But something feels off - and you can't explain why.",
    "You leave with a beautiful deck and a simple question you can't answer: Is this real innovation, or an expensive science project? Large VCs have CTOs on speed dial to answer that question. You have Google and a gut feeling.",
    "That's not due diligence. That's hope with a checkbook."
];

// Wave grid image component with vignette
const WaveGridImage = () => (
    <div className="absolute bottom-0 left-0 right-0 h-48 md:h-72 overflow-hidden pointer-events-none z-20">
        {/* Wave grid image - full opacity */}
        <img
            src="/wave-grid.webp"
            alt=""
            className="w-full h-full object-cover object-center"
        />
        {/* Vignette overlay - darkens edges */}
        <div
            className="absolute inset-0"
            style={{
                background: `
                    linear-gradient(to bottom, #080808 0%, transparent 40%),
                    linear-gradient(to top, #080808 0%, transparent 30%),
                    linear-gradient(to right, #080808 0%, transparent 15%),
                    linear-gradient(to left, #080808 0%, transparent 15%)
                `
            }}
        />
    </div>
);

export const Opening = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth scroll phases:
    // Phase 1 (0-60%): Scroll text up smoothly until last line reaches center
    // Phase 2 (60-85%): Pause scroll while last line grows
    // After 85%: Section ends, page scrolls naturally to next section
    const yOffset = useTransform(
        scrollYProgress,
        [0, 0.6, 0.85, 1],
        ['20vh', '-10vh', '-10vh', '-10vh']
    );

    // Scale up the last line during the pause phase
    const lastLineScale = useTransform(scrollYProgress, [0.6, 0.75, 0.85], [1, 1.4, 1.4]);
    const lastLineOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0.6, 1]);

    return (
        <>
            <section
                ref={containerRef}
                className="relative bg-luminaq-bg"
                style={{ height: '180vh' }}
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

                    {/* Scrolling text - z-10 so it appears behind wave grid */}
                    <motion.div
                        className="absolute left-0 right-0 px-6 z-10"
                        style={{ y: yOffset }}
                    >
                        <div className="max-w-2xl mx-auto space-y-12 md:space-y-32">
                            {storyBlocks.slice(0, -1).map((text, index) => (
                                <p
                                    key={index}
                                    className={`text-justify text-lg md:text-xl leading-relaxed ${index === 5
                                        ? 'text-white italic'
                                        : 'text-luminaq-muted font-light'
                                        }`}
                                >
                                    {text}
                                </p>
                            ))}
                            {/* Last line with scaling effect */}
                            <motion.p
                                className="text-center text-lg md:text-xl leading-relaxed text-white font-medium max-w-[70%] mx-auto md:max-w-none"
                                style={{
                                    scale: lastLineScale,
                                    opacity: lastLineOpacity
                                }}
                            >
                                {storyBlocks[storyBlocks.length - 1]}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Wave grid visual at bottom */}
                    <WaveGridImage />

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

            {/* Extended FOMO Story - separate section, immediately follows */}
            <section className="relative bg-luminaq-bg py-12 md:py-16">
                <div className="max-w-3xl mx-auto px-6">

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-center space-y-6"
                    >
                        {/* Opening line */}
                        <p className="text-xl md:text-2xl text-luminaq-accent font-serif italic mb-8">
                            And here's the other fear no one talks about:
                        </p>

                        {/* Story flow - justified text, consolidated paragraphs */}
                        <div className="space-y-5 text-lg md:text-xl leading-relaxed text-justify">
                            <p className="text-luminaq-muted font-light">
                                <span className="text-white font-medium">You passed on a deal two years ago. It 10x'd.</span> Now every AI pitch feels like that one. The <span className="text-white italic">FOMO</span> is louder than your due diligence.
                            </p>

                            <p className="text-luminaq-muted font-light">
                                So you wire the money. Eighteen months later, the startup pivots twice and quietly shuts down. <span className="text-white/50 italic">You don't talk about that one at dinner parties.</span>
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="py-4">
                            <div className="w-16 h-px mx-auto bg-luminaq-accent/40" />
                        </div>

                        {/* Conclusion */}
                        <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-2xl mx-auto">
                            We help you break that cycle - not by making you say <span className="text-white/50">"no"</span> to everything,
                            but by giving you the confidence to say <span className="text-luminaq-accent font-serif italic">"yes"</span> to the right ones.
                        </p>
                    </motion.div>

                </div>
            </section>
        </>
    );
};
