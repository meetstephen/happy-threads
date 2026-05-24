import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, Gem, Layers, Palette, Pen, Ruler, Scissors, Shirt, Sparkles, Wand2 } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

const services = [
  {
    icon: Crown,
    title: 'Bridal Couture',
    desc: 'From engagement to white wedding & reception — fully bespoke gowns over 4 fittings.',
  },
  {
    icon: Gem,
    title: 'Aso-Ebi & Owambe',
    desc: 'Show-stopping ensembles for your owambe, traditional wedding, or family celebration.',
  },
  {
    icon: Sparkles,
    title: 'Evening & Red Carpet',
    desc: 'Made-to-measure cocktail dresses and gowns sculpted for unforgettable nights.',
  },
  {
    icon: Shirt,
    title: 'Corporate & Ready-to-Wear',
    desc: 'Tailored co-ords, blouses, and dresses for the modern professional woman.',
  },
  {
    icon: Ruler,
    title: "Men's Tailoring",
    desc: 'Bespoke suits, agbada, kaftans, shirts and trousers with precise made-to-measure fit.',
  },
  {
    icon: Wand2,
    title: 'Alterations & Restyling',
    desc: 'Tailored adjustments and creative restyling — give a beloved piece a new life.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Atelier Services</p>
          <h2 className="display-2 mt-4">Everything you'd ever need stitched.</h2>
          <div className="gold-divider mt-8" />
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="card-glow group relative overflow-hidden rounded-2xl border border-ink-800/10 bg-cream-50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-bronze-500 dark:border-cream-100/10 dark:bg-ink-800"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-bronze-400/15 transition-transform duration-700 group-hover:scale-150" />
              <Icon className="relative text-bronze-500" size={28} />
              <h3 className="relative mt-5 font-display text-2xl">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-800/70 dark:text-cream-100/70">
                {desc}
              </p>
              <a
                href={buildWhatsAppUrl(generalEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-5 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.22em] text-bronze-500 transition-colors hover:text-wine-500"
              >
                Enquire <ArrowUpRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Decorative fashion tools strip */}
        <div className="mt-14 flex items-center justify-center gap-4">
          {[Scissors, Ruler, Palette, Layers, Pen].map((Icon, i) => (
            <div key={i} className="flex items-center gap-4">
              <Icon size={18} className="text-bronze-400 opacity-50" />
              {i < 4 && (
                <span className="h-1 w-1 rounded-full bg-bronze-400/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
