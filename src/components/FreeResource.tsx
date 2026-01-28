import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export const FreeResource = () => {
    return (
        <section className="py-24 bg-luminaq-bg relative border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                        Free Resource
                    </span>

                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                        Not Ready for a <span className="italic">Full Audit?</span>
                    </h2>

                    <p className="text-luminaq-muted text-xl md:text-2xl font-light mb-8">
                        Start with the questions that matter.
                    </p>

                    <div className="space-y-6 text-luminaq-muted text-lg font-light mb-12 max-w-2xl mx-auto">
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
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <button
                            className="group flex items-center gap-3 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/5 text-white px-10 py-5 rounded-full font-medium transition-all duration-300 text-lg"
                        >
                            <Download className="w-5 h-5" aria-hidden="true" />
                            Download the Free Guide
                        </button>

                        <p className="text-luminaq-muted text-sm font-light">
                            PDF download. No email required.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
