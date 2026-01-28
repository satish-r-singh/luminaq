import { motion } from 'framer-motion';

export const Opening = () => {
    return (
        <section className="py-24 bg-luminaq-bg relative">
            <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="text-luminaq-accent text-xs font-medium uppercase tracking-widest mb-6 block">
                        The Reality
                    </span>

                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-12 leading-tight">
                        You've Been Here Before
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 text-luminaq-muted text-lg md:text-xl leading-relaxed font-light"
                >
                    <p>
                        You're in the pitch meeting. The founder says "fine-tuned LLM with proprietary embeddings."
                    </p>

                    <p>
                        You nod. You smile. You have no idea if that's impressive or meaningless.
                    </p>

                    <p>
                        The demo looks incredible. The team seems smart. The market opportunity sounds massive.
                    </p>

                    <p>
                        But something feels off—and you can't explain why.
                    </p>

                    <p>
                        You leave with a beautiful deck and a simple question you can't answer: <span className="text-white italic">Is this real innovation, or an expensive science project?</span>
                    </p>

                    <p className="pt-4">
                        Large VCs have CTOs on speed dial to answer that question.
                    </p>

                    <p>
                        You have Google and a gut feeling.
                    </p>

                    <p className="text-white font-normal pt-4">
                        That's not due diligence. That's hope with a checkbook.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
