import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Ruler, Send, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Measurement {
  key: string;
  label: string;
  hint: string;
  womensOnly?: boolean;
  mensOnly?: boolean;
}

const MEASUREMENTS: Measurement[] = [
  { key: 'bust', label: 'Bust / Chest', hint: 'Around the fullest part, keep tape level', womensOnly: false },
  { key: 'underbust', label: 'Underbust', hint: 'Just below the bust line', womensOnly: true },
  { key: 'waist', label: 'Natural Waist', hint: 'Narrowest part of your torso' },
  { key: 'hips', label: 'Hips', hint: 'Around the fullest part of your hips' },
  { key: 'shoulder', label: 'Shoulder Width', hint: 'From shoulder edge to shoulder edge across the back' },
  { key: 'sleeve', label: 'Sleeve Length', hint: 'From shoulder edge down to wrist' },
  { key: 'inseam', label: 'Inseam', hint: 'From inner thigh to ankle (for trousers)' },
  { key: 'gownLength', label: 'Full Length', hint: 'Shoulder to floor (for gowns/dresses)' },
  { key: 'thigh', label: 'Thigh', hint: 'Around the fullest part of one thigh', mensOnly: false },
  { key: 'neck', label: 'Neck', hint: 'Around the base of your neck (for shirts)', mensOnly: true },
];

export default function SizeGuide({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [garment, setGarment] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState<'cm' | 'inches'>('inches');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const update = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const sendToWhatsApp = () => {
    const lines = MEASUREMENTS
      .filter((m) => values[m.key]?.trim())
      .map((m) => `• ${m.label}: ${values[m.key]} ${unit}`);

    const message = `Hello Happiness! 👋

I'd like to share my measurements for an order.

👤 Name: ${name || '(to be confirmed)'}
👗 Garment: ${garment || '(to be discussed)'}

📏 Measurements (${unit}):
${lines.length > 0 ? lines.join('\n') : '(none filled yet — happy to do a guided video call)'}

Looking forward to hearing from you!`;

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/85 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[90vh] w-full max-w-3xl grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl bg-cream-100 shadow-luxe dark:bg-ink-800"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-100/90 text-ink-800 backdrop-blur-md transition-colors hover:bg-cream-100 dark:bg-ink-900/90 dark:text-cream-100"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <header className="border-b border-ink-800/10 p-6 pr-16 dark:border-cream-100/10">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
                <Ruler size={20} />
              </div>
              <p className="eyebrow mt-4">Size & Measurement Guide</p>
              <h3 className="display-3 mt-2">Got 5 minutes? Send your measurements.</h3>
              <p className="mt-3 text-sm text-ink-800/65 dark:text-cream-100/65">
                Fill in what you can — even just a few — and we'll send the
                rest as a guided WhatsApp video call. All you need is a regular
                tape measure (or a piece of string + a ruler).
              </p>
            </header>

            {/* Body — scrollable */}
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ada"
                    className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">
                    Garment (optional)
                  </label>
                  <input
                    type="text"
                    value={garment}
                    onChange={(e) => setGarment(e.target.value)}
                    placeholder="e.g. Aso-ebi gown"
                    className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                  />
                </div>
              </div>

              {/* Unit toggle */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.22em] text-ink-800/60 dark:text-cream-100/60">
                  Unit:
                </span>
                <div className="inline-flex rounded-full border border-ink-800/15 p-0.5 dark:border-cream-100/20">
                  {(['inches', 'cm'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`rounded-full px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                        unit === u
                          ? 'bg-ink-800 text-cream-100 dark:bg-cream-100 dark:text-ink-900'
                          : 'text-ink-800/60 dark:text-cream-100/60'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurements grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {MEASUREMENTS.map((m) => (
                  <div key={m.key}>
                    <label className="mb-1 block text-xs uppercase tracking-[0.18em] text-ink-800/70 dark:text-cream-100/70">
                      {m.label}
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={values[m.key] ?? ''}
                      onChange={(e) => update(m.key, e.target.value)}
                      placeholder={`e.g. 36`}
                      className="w-full rounded-full border border-ink-800/15 bg-transparent px-5 py-2.5 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20"
                    />
                    <p className="mt-1 text-[11px] text-ink-800/50 dark:text-cream-100/50">
                      {m.hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-ink-800/10 bg-cream-50 p-4 dark:border-cream-100/10 dark:bg-ink-900/50">
              <button
                type="button"
                onClick={sendToWhatsApp}
                className="btn-whatsapp w-full"
              >
                <Send size={14} /> Send via WhatsApp
                <MessageCircle size={14} />
              </button>
              <p className="mt-2.5 text-center text-[11px] text-ink-800/50 dark:text-cream-100/50">
                Your details are sent as a WhatsApp message — nothing is stored on this site.
              </p>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
