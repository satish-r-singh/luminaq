import { motion } from 'framer-motion';
import { Terminal, Layers, Fingerprint, Cpu, GitBranch, BrainCircuit } from 'lucide-react';

const services = [
  {
    icon: <Terminal className="w-6 h-6" aria-hidden="true" />,
    title: "Codebase Integrity",
    desc: "We analyze repository history, commit quality, and debt ratio. No more spaghetti code disguised as 'proprietary algo'."
  },
  {
    icon: <Layers className="w-6 h-6" aria-hidden="true" />,
    title: "Architecture Scalability",
    desc: "Can it handle 10M users? Or will it crash at 10k? We stress-test the theoretical limits of their infra."
  },
  {
    icon: <Fingerprint className="w-6 h-6" aria-hidden="true" />,
    title: "IP & License Exposure",
    desc: "Detecting GPL violations and copied StackOverflow snippets that jeopardize your IP ownership."
  },
  {
    icon: <Cpu className="w-6 h-6" aria-hidden="true" />,
    title: "Inference Cost Analysis",
    desc: "The unit economics of AI are brutal. We validate their token usage projections against real-world benchmarks."
  },
  {
    icon: <GitBranch className="w-6 h-6" aria-hidden="true" />,
    title: "Data Lineage & Privacy",
    desc: "Is the training data clean? Legal? We audit data pipelines for GDPR/regulatory compliance gaps."
  },
  {
    icon: <BrainCircuit className="w-6 h-6" aria-hidden="true" />,
    title: "Model Moat Validation",
    desc: "Are they actually fine-tuning Llama-3, or just prompting GPT-4 with a system wrapper? We find out."
  }
];

export const TrustGrid = () => {
  return (
    <section id="audit" className="py-24 bg-luminaq-bg relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            What We <span className="italic text-luminaq-accent">Audit</span>
          </h2>
          <p className="text-luminaq-muted text-lg font-light">
            Our due diligence framework covers the six critical vectors of AI technical risk.
            We provide binary answers to complex questions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 border border-luminaq-border rounded-[2px] bg-luminaq-surface hover:border-luminaq-accent/50 transition-colors duration-500 relative"
            >
              <div className="text-luminaq-accent mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                {service.icon}
              </div>

              <h3 className="text-xl font-serif text-white mb-3">
                {service.title}
              </h3>

              <p className="text-luminaq-muted leading-relaxed text-sm font-light">
                {service.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};