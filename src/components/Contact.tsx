import { motion } from 'framer-motion';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  buildWhatsAppUrl,
  generalEnquiryMessage,
  WHATSAPP_DISPLAY,
  WHATSAPP_PHONE,
} from '../utils/whatsapp';

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container-luxe">
        <div className="overflow-hidden rounded-[2rem] bg-ink-800 px-8 py-16 text-cream-100 shadow-luxe md:px-16 md:py-20 dark:bg-cream-100 dark:text-ink-900">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="eyebrow text-bronze-400">Let's create together</p>
              <h2 className="display-2 mt-4 text-cream-100 dark:text-ink-900">
                Ready for something <span className="italic text-bronze-400">made for you?</span>
              </h2>
              <p className="mt-6 max-w-md text-cream-100/75 dark:text-ink-900/75">
                WhatsApp is the fastest way to reach Happiness. Share inspiration photos,
                your event date, and your city — she'll take it from there.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppUrl(generalEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
                <a
                  href={`tel:+${WHATSAPP_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-100/30 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-cream-100 transition-all hover:border-cream-100 hover:bg-cream-100 hover:text-ink-900 dark:border-ink-900/30 dark:text-ink-900 dark:hover:bg-ink-900 dark:hover:text-cream-100"
                >
                  <Phone size={16} /> Call
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5"
            >
              <ContactRow icon={MessageCircle} label="WhatsApp" value={WHATSAPP_DISPLAY} />
              <ContactRow icon={Phone} label="Phone" value={WHATSAPP_DISPLAY} />
              <ContactRow icon={Instagram} label="Instagram" value="@happiness.fashion" />
              <ContactRow icon={Mail} label="Email" value="atelier@happinessfashion.com" />
              <ContactRow
                icon={MapPin}
                label="Atelier"
                value="Abakaliki, Ebonyi State, Nigeria — by appointment"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-cream-100/15 pb-4 dark:border-ink-900/15">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bronze-400/20 text-bronze-400">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-cream-100/60 dark:text-ink-900/60">
          {label}
        </div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
