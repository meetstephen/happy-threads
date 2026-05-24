import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Pen, Ruler, Scissors, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';
import { pexels } from '../utils/images';
import { BRAND_STATS } from '../utils/constants';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const HERO_IMAGE = pexels(7869226, 1200, 1500);

const DEFAULT_HEADLINE = 'Naija couture stitched with love.';
const DEFAULT_SUBTEXT =
  "I'm Happiness — an Abakaliki-based fashion designer crafting bespoke aso-ebi, owambe sets, bridal couture, Ankara co-ords, kaftans, and sharp men's tailoring. Every piece is hand-finished in my atelier and made-to-measure for you.";

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-16 md:pt-40 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-bronze-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-wine-500/15 blur-3xl"
      />

      {/* Floating fashion icons */}
      <Scissors
        aria-hidden
        size={48}
        className="pointer-events-none absolute right-[12%] top-[18%] z-0 animate-float text-bronze-400 opacity-[0.12]"
      />
      <Ruler
        aria-hidden
        size={40}
        className="pointer-events-none absolute bottom-[22%] left-[8%] z-0 animate-float text-bronze-400 opacity-[0.10] [animation-delay:1.5s]"
      />
      <Pen
        aria-hidden
        size={36}
        className="pointer-events-none absolute bottom-[35%] right-[6%] z-0 animate-float text-wine-400 opacity-[0.08] [animation-delay:3s]"
      />

      <div className="container-luxe grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink-800/15 bg-cream-100/40 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.32em] text-ink-800/70 backdrop-blur dark:border-cream-100/15 dark:bg-ink-800/40 dark:text-cream-100/70"
          >
            <MapPin size={12} className="text-bronze-500" />
            Est. 2019 &bull; Luxury Bespoke Couture &bull; Abakaliki
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-1 mt-6"
          >
            <EditableText contentKey="hero.headline" defaultValue={DEFAULT_HEADLINE}>
              {(text) => {
                // Split at the last two words for styling
                const words = text.split(' ');
                if (words.length <= 3) {
                  return <span className="italic text-bronze-500">{text}</span>;
                }
                const first = words.slice(0, 2).join(' ');
                const rest = words.slice(2).join(' ');
                return (
                  <>
                    {first}
                    <br />
                    <span className="italic text-bronze-500">{rest}</span>
                  </>
                );
              }}
            </EditableText>
          </motion.h1>

          {/* Animated gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-bronze-500 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-ink-800/75 md:text-lg dark:text-cream-100/75"
          >
            <EditableText contentKey="hero.subtext" defaultValue={DEFAULT_SUBTEXT} multiline>
              {(text) => <>{text}</>}
            </EditableText>
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
            className="mt-10 inline-flex rounded-2xl border border-ink-800/10 bg-cream-100/60 px-6 py-4 backdrop-blur-md md:mt-12 dark:border-cream-100/10 dark:bg-ink-800/60"
          >
            <div className="flex flex-wrap items-center gap-5 text-sm text-ink-800/70 sm:gap-8 dark:text-cream-100/70">
            <div>
              <div className="font-display text-2xl text-ink-800 sm:text-3xl dark:text-cream-100">{BRAND_STATS.clientsDressed}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] sm:text-xs">Clients dressed</div>
            </div>
            <div className="h-8 w-px bg-ink-800/20 sm:h-10 dark:bg-cream-100/20" />
            <div>
              <div className="font-display text-2xl text-ink-800 sm:text-3xl dark:text-cream-100">{BRAND_STATS.yearsOfCraft} yrs</div>
              <div className="text-[10px] uppercase tracking-[0.25em] sm:text-xs">Of craftsmanship</div>
            </div>
            <div className="h-8 w-px bg-ink-800/20 sm:h-10 dark:bg-cream-100/20" />
            <div>
              <div className="inline-flex items-center gap-1.5 font-display text-2xl text-ink-800 sm:text-3xl dark:text-cream-100">
                <Sparkles size={16} className="text-bronze-500 sm:h-[18px] sm:w-[18px]" />
                AI
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] sm:text-xs">Stylist on site</div>
            </div>
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
              <EditableImage
                contentKey="hero.image"
                defaultSrc={HERO_IMAGE}
                alt="A model wearing a Happiness Fashion design"
                className="luxe-image h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-cream-100/85 px-4 py-3 backdrop-blur-md dark:bg-ink-800/85">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-bronze-500">
                    Featured
                  </div>
                  <div className="font-display text-base">Igbo Bridal Blouse & Wrapper</div>
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
