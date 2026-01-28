import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const stats = [
    { value: "20+", label: "Technical Audits Completed" },
    { value: "$2M+", label: "Capital Protected from Vaporware" },
    { value: "9", label: "Deals Killed Before Investment" }
];

export const Proof = () => {
    return (
        <section className="py-24 bg-luminaq-bg relative border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                        Track Record
                    </span>

                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                        Deals Examined. <span className="italic text-luminaq-muted">Capital Protected.</span>
                    </h2>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-8 border border-luminaq-border rounded-[2px] bg-luminaq-surface"
                        >
                            <p className="font-serif text-5xl md:text-6xl lg:text-7xl text-luminaq-accent mb-4 italic">
                                {stat.value}
                            </p>
                            <p className="text-luminaq-muted text-sm uppercase tracking-widest font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto text-center mb-12"
                >
                    <div className="relative">
                        <Quote
                            className="w-12 h-12 text-luminaq-accent/30 mx-auto mb-6"
                            aria-hidden="true"
                        />

                        <blockquote className="font-serif text-2xl md:text-3xl text-white leading-relaxed italic mb-8">
                            "Satish identified three critical technical risks we completely missed. His audit saved us from a six-figure mistake on what turned out to be a glorified GPT wrapper."
                        </blockquote>

                        <cite className="text-luminaq-muted text-lg not-italic">
                            — Angel Investor, UAE
                        </cite>
                    </div>
                </motion.div>

                {/* Trust Line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-luminaq-muted text-sm font-light max-w-2xl mx-auto"
                >
                    Corporate AI training delivered to teams at Emirates Institute of Finance, Vinsys, Mindworx, and The Knowledge Academy.
                </motion.p>
            </div>
        </section>
    );
};
