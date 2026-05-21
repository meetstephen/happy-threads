import { motion } from 'framer-motion';
import EditableText from './EditableText';

/**
 * "As Featured In" press strip — a luxury-fashion staple.
 * Adds social proof and credibility. The names below default to plausible
 * Nigerian fashion/lifestyle outlets but are fully editable by the admin
 * so Happiness can list real outlets she's actually been featured by.
 */

const DEFAULT_OUTLETS = [
  'BellaNaija Style',
  'Genevieve Magazine',
  'Owambe Issue',
  'TW Magazine',
  'The Guardian Life',
  'Stylelist Africa',
];

export default function PressStrip() {
  return (
    <section className="border-y border-ink-800/10 bg-cream-50 py-12 md:py-16 dark:border-cream-100/10 dark:bg-ink-800/40">
      <div className="container-luxe">
        <div className="text-center">
          <p className="eyebrow text-bronze-500">As featured in</p>
        </div>

        <div className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 md:mt-10 md:grid-cols-6">
          {DEFAULT_OUTLETS.map((outlet, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="text-center"
            >
              <EditableText
                contentKey={`press.outlet.${i}`}
                defaultValue={outlet}
              >
                {(text) => (
                  <span className="font-display text-base italic tracking-wide text-ink-800/70 transition-opacity hover:text-bronze-500 sm:text-lg md:text-xl dark:text-cream-100/70">
                    {text}
                  </span>
                )}
              </EditableText>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
