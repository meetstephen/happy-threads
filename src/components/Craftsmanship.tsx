import { motion } from 'framer-motion';
import { Palette, Scissors, Ruler, Pen, Shirt, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Palette,
    title: 'Consultation',
    desc: 'We listen to your vision, event, and style preferences.',
  },
  {
    icon: Scissors,
    title: 'Fabric Selection',
    desc: "Hand-picked textiles from Nigeria's finest fabric markets.",
  },
  {
    icon: Ruler,
    title: 'Pattern & Cutting',
    desc: 'Precision-drafted patterns from your exact measurements.',
  },
  {
    icon: Pen,
    title: 'Hand Finishing',
    desc: 'Every seam, bead, and trim placed with intention.',
  },
  {
    icon: Shirt,
    title: 'Final Fitting',
    desc: 'Your piece, perfected and ready to turn heads.',
  },
];

export default function Craftsmanship() {
  return (
    <section id="process" className="py-20 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">The Atelier Experience</p>
          <h2 className="display-2 mt-4">Our Process</h2>
          <div className="section-divider mt-8"><Sparkles size={14} className="text-bronze-500" /></div>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="mt-16 hidden md:block">
          <div className="relative flex items-start justify-between">
            {/* Connecting line */}
            <div className="absolute top-10 left-[10%] right-[10%] h-px bg-bronze-400/30" />

            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative flex w-1/5 flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-bronze-400/40 bg-cream-100 shadow-sm dark:bg-ink-800">
                  <Icon className="text-bronze-500" size={30} />
                </div>
                {/* Dot on line */}
                <div className="mt-[-2px] h-1 w-1 rounded-full bg-bronze-500" />
                <h4 className="mt-4 font-display text-lg">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-800/65 dark:text-cream-100/65">
                  {desc}
                </p>
                {/* Step number */}
                <span className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bronze-500 text-[10px] font-bold text-cream-100">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="mt-14 md:hidden">
          <div className="relative border-l-2 border-bronze-400/30 pl-8">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative mb-10 last:mb-0"
              >
                {/* Dot on the line */}
                <div className="absolute -left-[calc(2rem+5px)] top-3 h-3 w-3 rounded-full border-2 border-bronze-500 bg-cream-100 dark:bg-ink-800" />
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-bronze-400/40 bg-cream-100/80 dark:bg-ink-800/80">
                    <Icon className="text-bronze-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-display text-lg">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink-800/65 dark:text-cream-100/65">
                      {desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
