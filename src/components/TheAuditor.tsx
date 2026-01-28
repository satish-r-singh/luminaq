import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const credentials = [
  "Ex-Group Lead Data Scientist",
  "15 Years Enterprise IT & Data Architecture",
  "4 Years Specialized in Generative AI & LLMs",
  "100% Independent (No Equity Conflicts)"
];

export const TheAuditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} id="auditor" className="py-24 bg-luminaq-surface relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 relative"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[4/5] w-full max-w-md mx-auto bg-luminaq-elevated border border-luminaq-border overflow-hidden"
            >
              <img
                src="/satishsingh.webp"
                alt="Satish Singh - Lead Data Scientist"
                className="w-full h-full object-cover grayscale hover:scale-105 transition-transform duration-700 ease-out object-top"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Vignette for seamless blending */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#0a0a0a_100%)] z-10" aria-hidden="true" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_40px_#0a0a0a] z-10" aria-hidden="true" />

              {/* Experience Badge */}
              <div className="absolute bottom-6 right-6 bg-[#C8C8C8] text-black px-6 py-5 z-20 shadow-2xl min-w-[140px]">
                <p className="font-serif text-3xl italic font-semibold text-black mb-1">15+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/90">Years Experience</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12 flex flex-col justify-center"
          >
            <h4 className="text-luminaq-accent font-medium uppercase tracking-widest text-xs mb-6">The Technical Auditor</h4>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
              We Don't Send Juniors.<br />
              <span className="text-luminaq-muted italic">We send AI Natives.</span>
            </h2>

            <p className="text-lg text-luminaq-muted mb-8 leading-relaxed max-w-2xl font-light">
              Founders can charm a generalist VC, but they can't hide bad architecture from a veteran engineer. Our lead auditor, Satish Rohit Singh, has deployed production AI/ML systems for and scaled data infrastructure to petabyte levels before "Big Data" was a buzzword.
              We audit code, not just slide decks.
            </p>

            <ul className="flex flex-col gap-5 mb-10" role="list">
              {credentials.map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-luminaq-accent flex-shrink-0" aria-hidden="true" />
                  <span className="text-luminaq-text/90 text-lg font-light">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};