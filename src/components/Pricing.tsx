import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-luminaq-surface relative border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                    {/* Left Column - Investment/Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-center flex flex-col h-full bg-luminaq-card border border-luminaq-accent/30 rounded-[2px] p-10 md:p-14 hover:border-luminaq-accent/60 shadow-[0_0_40px_-10px_rgba(161,131,93,0.15)] hover:shadow-[0_0_60px_-10px_rgba(161,131,93,0.25)] transition-[border-color,box-shadow] duration-300 cursor-default"
                    >
                        <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                            Investment
                        </span>

                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-8 leading-tight">
                            Audit <span className="italic text-luminaq-accent">Pricing</span>
                        </h2>

                        <div className="space-y-6 text-luminaq-muted text-lg font-light mb-12 flex-grow">
                            <p>
                                Pricing depends on deal complexity, data room size, and technical depth required.
                            </p>

                            <p className="text-sm text-luminaq-muted/70">
                                For angel investors where the investment is large enough that being wrong hurts.
                            </p>

                            <p className="text-white font-serif text-2xl md:text-3xl italic">
                                Starting from AED 1,499.
                            </p>

                            <p>
                                Enterprise engagements and retainer arrangements available for active investors evaluating multiple deals.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <a
                                href="https://calendly.com/satish-r-singh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 bg-luminaq-accent hover:bg-luminaq-accentHover text-white px-10 py-5 rounded-full font-medium transition-all duration-300 text-lg"
                            >
                                Request a Custom Quote
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </a>

                            <p className="text-luminaq-muted text-sm font-light">
                                You'll receive a detailed proposal within 48 hours. No obligation.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Free Resource */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-center flex flex-col h-full bg-luminaq-card border border-luminaq-border rounded-[2px] p-10 md:p-14 hover:border-white/20 transition-[border-color,box-shadow] duration-300 cursor-default"
                    >
                        <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                            Free Resource
                        </span>

                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                            Not Ready for a <span className="italic">Full Audit?</span>
                        </h2>

                        <p className="text-luminaq-muted text-xl md:text-2xl font-light mb-8">
                            Start with the questions that matter.
                        </p>

                        <div className="space-y-6 text-luminaq-muted text-lg font-light mb-12 flex-grow">
                            <p>
                                <span className="text-white font-medium">The AI Pitch Decoder</span> is a free guide with 10 questions non-technical investors can ask to evaluate any AI startup pitch—and exactly what the answers should sound like.
                            </p>

                            <p>
                                No jargon. No engineering degree required. Just a framework that separates real innovation from expensive demos.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <a
                                href="/ai-pitch-decoder.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/5 text-white px-10 py-5 rounded-full font-medium transition-all duration-300 text-lg"
                            >
                                <Download className="w-5 h-5" aria-hidden="true" />
                                Download the Free Guide
                            </a>

                            <p className="text-luminaq-muted text-sm font-light">
                                PDF download. No email required.
                            </p>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
