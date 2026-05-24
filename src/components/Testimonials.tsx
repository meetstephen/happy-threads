import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import EditableText from './EditableText';

/**
 * Each testimonial is fully editable in-place by the admin —
 * name, role, and the quote itself. Defaults below are placeholders
 * Happiness can replace with her real client testimonials over time.
 */

const testimonials = [
  {
    key: 't1',
    name: 'Adaeze O.',
    role: 'Bride • Lagos',
    quote:
      'Happiness made my dream wedding gown come to life. Three fittings, every detail perfect — I cried when I tried it on. Worth every Naira.',
  },
  {
    key: 't2',
    name: 'Folake A.',
    role: 'Executive • Abuja',
    quote:
      'I have ordered five suits from her now. The fit is unreal — like the fabric was painted on. My boardroom secret weapon.',
  },
  {
    key: 't3',
    name: 'Tobi K.',
    role: 'Groom • Port Harcourt',
    quote:
      'My agbada for our traditional wedding was stunning. The embroidery, the drape — guests are still asking who made it. Easy 5/5.',
  },
  {
    key: 't4',
    name: "Kemi I.",
    role: "Bride's mother • Lagos",
    quote:
      "She handled my entire family's aso-ebi for the wedding — eight outfits, all on time, all gorgeous. Genuine craftsmanship.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-cream-200/40 py-20 md:py-32 dark:bg-ink-800/40">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Kind Words</p>
          <h2 className="display-2 mt-4">Loved by women who know good clothes.</h2>
          <div className="gold-divider mt-8" />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-ink-800/10 border-l-4 border-l-bronze-500 bg-cream-50 p-8 shadow-soft gold-glow dark:border-cream-100/10 dark:border-l-bronze-400 dark:bg-ink-800"
            >
              <Quote className="absolute right-6 top-6 text-bronze-400/40" size={48} />
              <Quote className="absolute left-6 bottom-6 rotate-180 text-bronze-400/20" size={32} />
              <div className="flex gap-1 text-bronze-500">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-xl leading-snug md:text-2xl">
                "<EditableText
                  contentKey={`testimonial.${t.key}.quote`}
                  defaultValue={t.quote}
                  multiline
                >
                  {(text) => <>{text}</>}
                </EditableText>"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-bronze-400/20 font-display text-bronze-500">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-medium">
                    <EditableText
                      contentKey={`testimonial.${t.key}.name`}
                      defaultValue={t.name}
                    >
                      {(text) => <>{text}</>}
                    </EditableText>
                  </div>
                  <div className="text-xs uppercase tracking-[0.22em] text-ink-800/55 dark:text-cream-100/55">
                    <EditableText
                      contentKey={`testimonial.${t.key}.role`}
                      defaultValue={t.role}
                    >
                      {(text) => <>{text}</>}
                    </EditableText>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
