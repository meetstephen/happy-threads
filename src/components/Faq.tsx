import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

const faqs = [
  {
    q: 'How much do your designs cost?',
    a: 'Pricing depends on the piece, fabric, and detailing. Ready-to-wear and Ankara start from ₦15,000. Aso-ebi sets typically run ₦35,000 – ₦120,000. Bridal couture is ₦150,000 – ₦600,000+ depending on complexity. Send your inspiration photo on WhatsApp for an exact quote.',
  },
  {
    q: 'How long does it take to make a design?',
    a: 'Ready-to-wear and alterations take 5 – 10 days. Aso-ebi sets and corporate co-ords take 2 – 3 weeks. Bridal couture is 4 – 8 weeks (with 3 fittings). Rush orders are sometimes possible — message Happiness with your event date.',
  },
  {
    q: "Where are you based? Can I visit the studio?",
    a: "We're in Abakaliki, Ebonyi State, Nigeria. Studio visits are by appointment only, Monday – Saturday. Send a WhatsApp message to schedule your slot.",
  },
  {
    q: "What if I'm not in Abakaliki — can you still make for me?",
    a: 'Absolutely. We dress clients across Nigeria. We do a guided WhatsApp video call to take measurements (about 10 minutes) and ship to your city via reliable couriers like GIG Logistics — usually 2 – 4 days.',
  },
  {
    q: 'How do I take measurements myself?',
    a: "Don't worry about that — Happiness will guide you over a video call, step-by-step. All you need is a regular tape measure (or a piece of string + a ruler).",
  },
  {
    q: 'How do I pay?',
    a: 'A 50% deposit secures your slot — by bank transfer, Opay, or cash. The balance is due before pickup or shipping. We share account details on WhatsApp once you confirm an order.',
  },
  {
    q: 'Do you sew for men too?',
    a: "Yes! We tailor men's agbada, kaftans, dress shirts, trousers, and slim-cut suits — fully made-to-measure.",
  },
  {
    q: 'Can I bring my own fabric?',
    a: 'Of course. Many clients prefer it. We can also source any fabric for you — Ankara, Aso-Oke, French lace, silk, satin, brocade, or velvet.',
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container-luxe grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">Common questions</p>
          <h2 className="display-2 mt-4">Quick answers, before you ask.</h2>
          <p className="mt-6 text-ink-800/70 dark:text-cream-100/70">
            Don't see your question? Joy (the AI assistant in the corner) might know — or
            tap below to message Happiness directly.
          </p>
          <a
            href={buildWhatsAppUrl(generalEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-8 inline-flex"
          >
            <MessageCircle size={16} /> Ask on WhatsApp
          </a>
        </div>

        <div className="md:col-span-8">
          <div className="divide-y divide-ink-800/10 rounded-3xl border border-ink-800/10 bg-cream-50 dark:divide-cream-100/10 dark:border-cream-100/10 dark:bg-ink-800">
            {faqs.map((item, i) => {
              const open = openIdx === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  >
                    <span className="font-display text-lg md:text-xl">{item.q}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-bronze-500/40 transition-transform duration-300 ${
                        open ? 'rotate-180 bg-bronze-500 text-cream-100' : 'text-bronze-500'
                      }`}
                    >
                      <ChevronDown size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-800/75 md:px-6 md:pb-6 md:text-base dark:text-cream-100/75">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
