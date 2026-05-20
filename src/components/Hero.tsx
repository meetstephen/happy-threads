import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80';

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-bronze-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-wine-500/15 blur-3xl"
      />

      <div className="container-luxe grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink-800/15 bg-cream-100/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.32em] text-ink-800/70 backdrop-blur dark:border-cream-100/15 dark:bg-ink-800/40 dark:text-cream-100/70"
          >
            <Sparkles size={12} className="text-bronze-500" />
            Bespoke • Couture • Ready-to-Wear
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-1 mt-6"
          >
            Wear something
            <br />
            <span className="italic text-bronze-500">stitched with</span>{' '}
            <span className="italic">love.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-800/75 md:text-lg dark:text-cream-100/75"
          >
            I'm <strong className="font-medium">Happiness</strong> — a Nigerian fashion
            designer crafting bespoke women's couture, bridal gowns, aso-ebi, and refined
            menswear. Every piece is hand-finished in my atelier with measurements made
            for you alone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#collections" className="btn-primary">
              View Collection <ArrowRight size={16} />
            </a>
            <a
              href={buildWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Book a Fitting
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex items-center gap-8 text-sm text-ink-800/70 dark:text-cream-100/70"
          >
            <div>
              <div className="font-display text-3xl text-ink-800 dark:text-cream-100">200+</div>
              <div className="text-xs uppercase tracking-[0.25em]">Brides dressed</div>
            </div>
            <div className="h-10 w-px bg-ink-800/20 dark:bg-cream-100/20" />
            <div>
              <div className="font-display text-3xl text-ink-800 dark:text-cream-100">7 yrs</div>
              <div className="text-xs uppercase tracking-[0.25em]">Of craftsmanship</div>
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[3/4] w-full max-w-md"
          >
            <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[2rem] border border-bronze-500/40" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-luxe">
              <img
                src={HERO_IMAGE}
                alt="A model wearing a Happiness Fashion couture gown"
                className="luxe-image h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-cream-100/85 px-4 py-3 backdrop-blur-md dark:bg-ink-800/85">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-bronze-500">
                    Featured
                  </div>
                  <div className="font-display text-base">Burgundy Mermaid</div>
                </div>
                <a
                  href="#collections"
                  className="rounded-full bg-ink-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream-100 dark:bg-cream-100 dark:text-ink-900"
                >
                  Shop look
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
