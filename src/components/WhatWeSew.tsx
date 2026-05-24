import { motion } from 'framer-motion';
import {
  Users,
  Gem,
  Palette,
  Wind,
  Shield,
  Briefcase,
  Baby,
  Layers,
  Zap,
  Flower2,
  Sparkles,
  Waves,
  Triangle,
  Shirt,
  Crown,
  Pen,
} from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

const garmentTypes = [
  { icon: Users, name: 'Aso-Ebi Sets', desc: 'Matching family or group ensembles for owambe celebrations' },
  { icon: Gem, name: 'Bridal Gowns', desc: 'White wedding, traditional, and reception dresses' },
  { icon: Palette, name: 'Ankara Styles', desc: 'Co-ords, dresses, skirts, and tops in vibrant wax prints' },
  { icon: Wind, name: 'Kaftans & Boubous', desc: 'Flowing elegance with beaded and embroidered details' },
  { icon: Shield, name: 'Agbada', desc: 'Regal three-piece sets for distinguished gentlemen' },
  { icon: Briefcase, name: 'Corporate Suits', desc: 'Sharp blazers, trousers, and power co-ords' },
  { icon: Baby, name: "Children's Wear", desc: 'Mini versions of our adult styles for little ones' },
  { icon: Layers, name: 'Blouse & Wrapper', desc: 'Classic Nigerian combinations in George, lace, or Ankara' },
  { icon: Zap, name: 'Jumpsuits', desc: 'One-piece statements for the bold and fashion-forward' },
  { icon: Flower2, name: 'Peplum Tops', desc: 'Structured waist-nipping tops that flatter every figure' },
  { icon: Crown, name: 'Shift Dresses', desc: 'Effortless straight-cut dresses for everyday elegance' },
  { icon: Sparkles, name: 'Ball Gowns', desc: 'Full-skirted fairy-tale gowns for galas and special nights' },
  { icon: Waves, name: 'Mermaid Dresses', desc: 'Fitted silhouettes that flare dramatically at the knee' },
  { icon: Triangle, name: 'A-Line Dresses', desc: 'Universally flattering cuts that skim and flow' },
  { icon: Shirt, name: 'Senator Wear', desc: 'Clean-cut kaftans with subtle embroidery for men' },
  { icon: Pen, name: 'Bring Your Own Style', desc: 'Have a design in mind? Bring your inspiration and we create it' },
];

export default function WhatWeSew() {
  return (
    <section id="what-we-sew" className="py-20 md:py-32">
      <div className="container-luxe">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Bespoke Possibilities</p>
          <h2 className="display-2 mt-4">Every stitch, tailored to your vision.</h2>
          <div className="gold-divider mt-8" />
          <p className="mt-6 text-base leading-relaxed text-ink-800/70 md:text-lg dark:text-cream-100/70">
            From traditional Nigerian attire to modern silhouettes, we craft it all.
            Or bring your own design and watch it come to life.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {garmentTypes.map(({ icon: Icon, name, desc }, i) => {
            const isHighlighted = name === 'Bring Your Own Style';
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className={`card-glow group relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-1 ${
                  isHighlighted
                    ? 'border-bronze-500/60 bg-gradient-to-br from-bronze-400/10 via-cream-50 to-bronze-500/5 dark:from-bronze-500/10 dark:via-ink-800 dark:to-bronze-400/5'
                    : 'border-ink-800/10 bg-cream-50 hover:border-bronze-500 dark:border-cream-100/10 dark:bg-ink-800'
                }`}
              >
                <div
                  className={`absolute -right-4 -top-4 h-16 w-16 rounded-full transition-transform duration-700 group-hover:scale-150 ${
                    isHighlighted ? 'bg-bronze-500/20' : 'bg-bronze-400/10'
                  }`}
                />
                <Icon
                  className={`relative ${isHighlighted ? 'text-bronze-600 dark:text-bronze-400' : 'text-bronze-500'}`}
                  size={24}
                />
                <h4 className="relative mt-3 font-display text-base lg:text-lg">{name}</h4>
                <p className="relative mt-1 text-xs leading-relaxed text-ink-800/65 dark:text-cream-100/65 lg:text-sm">
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-14 max-w-2xl rounded-3xl border border-bronze-500/40 bg-gradient-to-r from-bronze-400/5 via-cream-50 to-bronze-400/5 p-8 text-center shadow-luxe dark:from-bronze-500/5 dark:via-ink-800 dark:to-bronze-500/5"
        >
          <Pen className="mx-auto text-bronze-500" size={32} />
          <h3 className="mt-4 font-display text-xl md:text-2xl">
            Have your own design? We'll bring your vision to life.
          </h3>
          <p className="mt-2 text-sm text-ink-800/70 dark:text-cream-100/70">
            Bring a sketch, a photo, or just describe it. Our atelier turns inspiration into reality.
          </p>
          <a
            href={buildWhatsAppUrl(generalEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex"
          >
            Send Your Design on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
