import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const Pricing = () => {
    return (
        <section id="pricing" className="py-24 bg-luminaq-surface relative border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                        Investment
                    </span>

                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                        Audit <span className="italic text-luminaq-accent">Pricing</span>
                    </h2>

                    <div className="space-y-6 text-luminaq-muted text-lg md:text-xl font-light mb-12">
                        <p>
                            Pricing depends on deal complexity, data room size, and technical depth required.
                        </p>

                        <p className="text-sm text-luminaq-muted/70">
                            For angel investors where the investment is large enough that being wrong hurts.
                        </p>

                        <p className="text-white font-serif text-2xl md:text-3xl italic">
                            Most audits fall between $2,500 – $7,500 USD.
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
            </div>
        </section>
    );
};
