import { motion } from 'framer-motion';
import { FileText, Search, ClipboardList, FileCheck, Video, HelpCircle } from 'lucide-react';

const deliverables = [
    {
        icon: <FileText className="w-6 h-6" aria-hidden="true" />,
        title: "Pre-Audit Deep Dive",
        desc: "We review everything before we talk—so you're not paying for us to get up to speed"
    },
    {
        icon: <Search className="w-6 h-6" aria-hidden="true" />,
        title: "Full Technical Assessment",
        desc: "A comprehensive audit across all six risk vectors—the diligence large VCs do internally"
    },
    {
        icon: <ClipboardList className="w-6 h-6" aria-hidden="true" />,
        title: "Written Audit Report",
        desc: "A 10-15 page document you can share with co-investors without embarrassment"
    },
    {
        icon: <FileCheck className="w-6 h-6" aria-hidden="true" />,
        title: "Executive Summary",
        desc: "A one-page verdict for people who don't have time to read 15 pages"
    },
    {
        icon: <Video className="w-6 h-6" aria-hidden="true" />,
        title: "60-Minute Debrief Call",
        desc: "We walk you through everything—no jargon, just straight answers to your questions"
    },
    {
        icon: <HelpCircle className="w-6 h-6" aria-hidden="true" />,
        title: "Founder Question List",
        desc: "The exact questions that make founders pause—so you don't have to guess what to ask"
    }
];

export const Deliverables = () => {
    return (
        <section id="deliverables" className="py-24 bg-luminaq-surface relative border-t border-white/5 overflow-hidden">
            {/* Blurred background image */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: 'url(/audit-report-bg.webp)',
                    backgroundSize: '150%',
                    backgroundPosition: 'center',
                    filter: 'blur(2px)'
                }}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-luminaq-surface/60" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
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
