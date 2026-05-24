import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';
import { BRAND_STATS } from '../utils/constants';

export default function BookingCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-800 py-20 md:py-32 dark:bg-ink-900">
      {/* Gold gradient border top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-500 to-transparent" />
      {/* Gold gradient border bottom */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze-500 to-transparent" />

      {/* Decorative background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-bronze-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-bronze-400/8 blur-3xl"
      />

      <div className="container-luxe relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow text-bronze-400">Your Journey Starts Here</p>

          <h2 className="display-2 mt-5 text-shimmer">
            Begin Your Bespoke Journey
          </h2>

          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-bronze-500 to-transparent" />

          <p className="mt-6 text-lg leading-relaxed text-cream-200/70">
            From consultation to final fitting, every step is crafted around you.
            Share your vision and let us bring it to life.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildWhatsAppUrl(generalEnquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle size={16} />
              Book a Consultation
            </a>
            <a
              href="#process"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-100/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-cream-100 transition-all duration-300 hover:border-cream-100 hover:bg-cream-100 hover:text-ink-900"
            >
              View Our Process
              <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-center text-cream-200/60 sm:gap-12"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-bronze-400" />
            <span className="text-xs uppercase tracking-[0.2em]">{BRAND_STATS.clientsDressed} Happy Clients</span>
          </div>
          <div className="hidden h-4 w-px bg-cream-100/20 sm:block" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-bronze-400" />
            <span className="text-xs uppercase tracking-[0.2em]">{BRAND_STATS.yearsOfCraft} Years</span>
          </div>
          <div className="hidden h-4 w-px bg-cream-100/20 sm:block" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-bronze-400" />
            <span className="text-xs uppercase tracking-[0.2em]">Made in Nigeria</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
