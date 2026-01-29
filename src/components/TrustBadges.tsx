import { motion } from 'framer-motion';
import { Shield, FileCheck } from 'lucide-react';

const trustItems = [
    {
        icon: <Shield className="w-5 h-5" />,
        text: "100% Independent — No Equity Conflicts"
    },
    {
        icon: <FileCheck className="w-5 h-5" />,
        text: "NDA Protected"
    },
    {
        icon: (
            <span className="text-lg leading-none">🇦🇪</span>
        ),
        text: "Based in UAE"
    }
];

export const TrustBadges = () => {
    return (
        <section className="py-12 bg-luminaq-bg border-t border-white/5">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center items-center gap-6 md:gap-12"
                >
                    {trustItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-luminaq-muted"
                        >
                            <span className="text-luminaq-accent/70">
                                {item.icon}
                            </span>
                            <span className="text-sm font-light tracking-wide">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
