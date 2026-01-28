import { motion } from 'framer-motion';
import { FileText, Search, ClipboardList, FileCheck, Video, HelpCircle } from 'lucide-react';

const deliverables = [
    {
        icon: <FileText className="w-6 h-6" aria-hidden="true" />,
        title: "Pre-Audit Deep Dive",
        desc: "We review the pitch deck, data room, and any technical documentation before we begin"
    },
    {
        icon: <Search className="w-6 h-6" aria-hidden="true" />,
        title: "Full Technical Assessment",
        desc: "Comprehensive review across all six risk vectors with evidence-based findings"
    },
    {
        icon: <ClipboardList className="w-6 h-6" aria-hidden="true" />,
        title: "Written Audit Report",
        desc: "10-15 page document with risk scores, technical findings, and strategic recommendations"
    },
    {
        icon: <FileCheck className="w-6 h-6" aria-hidden="true" />,
        title: "Executive Summary",
        desc: "One-page verdict your co-investors can read in two minutes"
    },
    {
        icon: <Video className="w-6 h-6" aria-hidden="true" />,
        title: "60-Minute Debrief Call",
        desc: "We walk you through every finding and answer your questions live"
    },
    {
        icon: <HelpCircle className="w-6 h-6" aria-hidden="true" />,
        title: "Founder Question List",
        desc: "Specific questions to ask the startup based on what we uncovered"
    }
];

export const Deliverables = () => {
    return (
        <section id="deliverables" className="py-24 bg-luminaq-surface relative border-t border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 max-w-2xl"
                >
                    <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                        The Deliverables
                    </span>

                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
                        What You <span className="italic text-luminaq-accent">Receive</span>
                    </h2>

                    <p className="text-luminaq-muted text-lg font-light">
                        Every audit includes a complete technical assessment and clear recommendations. No jargon. No ambiguity. Just the truth about the code.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {deliverables.map((item, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 border border-luminaq-border rounded-[2px] bg-luminaq-bg hover:border-luminaq-accent/50 transition-colors duration-500 relative"
                        >
                            <div className="text-luminaq-accent mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-serif text-white mb-3">
                                {item.title}
                            </h3>

                            <p className="text-luminaq-muted leading-relaxed text-sm font-light">
                                {item.desc}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};
