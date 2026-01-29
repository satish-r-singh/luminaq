import { motion } from 'framer-motion';

const forYouItems = [
    "You're writing checks between $25K – $250K into AI startups",
    "You see 5-15 pitch decks a month and can't tell which ones are real",
    "You've nodded through technical explanations you didn't fully understand",
    "You don't have a CTO friend you can text for a reality check",
    "You've either lost money on hype-or passed on deals out of uncertainty",
    "You want to say \"yes\" with confidence, not just \"no\" out of fear"
];

const notForYouItems = [
    "You're a VC with an in-house technical team",
    "You only invest in founders you personally know",
    "You're looking for someone to rubber-stamp a decision you've already made"
];

export const WhoWeHelp = () => {
    return (
        <section id="who-we-help" className="relative bg-luminaq-bg py-16 md:py-24">
            <div className="container mx-auto px-6">

                {/* Card with image and lists */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-lg overflow-hidden bg-gradient-to-br from-luminaq-surface to-luminaq-bg border border-white/10"
                >
                    <div className="grid md:grid-cols-[5fr_4fr]">
                        {/* Left Content - Lists */}
                        <div className="p-8 md:p-12 lg:p-14">
                            <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-8 block">
                                Who We Help
                            </span>

                            {/* For You Section */}
                            <div className="mb-10">
                                <h3 className="text-xl md:text-2xl font-serif text-white mb-6">
                                    This Is For You If...
                                </h3>
                                <div className="space-y-4">
                                    {forYouItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: 0.05 * index }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="flex-shrink-0 w-4 h-4 rounded-full border border-luminaq-accent/50 flex items-center justify-center mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-luminaq-accent" />
                                            </span>
                                            <p className="text-white/80 leading-relaxed font-light text-sm md:text-base">
                                                {item}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/10 mb-8" />

                            {/* Not For You Section */}
                            <div>
                                <h3 className="text-lg md:text-xl font-serif text-white/50 mb-5">
                                    This Is NOT For You If...
                                </h3>
                                <div className="space-y-3">
                                    {notForYouItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: 0.05 * index }}
                                            className="flex items-start gap-3"
                                        >
                                            <span className="flex-shrink-0 w-4 h-4 rounded-full border border-white/20 flex items-center justify-center mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                            </span>
                                            <p className="text-white/40 leading-relaxed font-light text-sm">
                                                {item}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative h-64 md:h-auto min-h-[300px]">
                            <img
                                src="/investor-clarity.png"
                                alt="Clarity through uncertainty"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Strong vignette overlay - smooth left blend */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `
                                        linear-gradient(to right, #0a0a0a 0%, #0a0a0a 10%, rgba(10,10,10,0.8) 25%, rgba(10,10,10,0.4) 45%, transparent 70%),
                                        linear-gradient(to left, #0a0a0a 0%, transparent 25%),
                                        linear-gradient(to bottom, #0a0a0a 0%, transparent 35%),
                                        linear-gradient(to top, #0a0a0a 0%, transparent 35%)
                                    `
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
