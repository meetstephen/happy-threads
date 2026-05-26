import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, RefreshCw, Sparkles } from 'lucide-react';
import { designs as staticDesigns, type ColorMood, type Design, type Occasion, type Vibe } from '../data/designs';
import { buildWhatsAppUrl, styleConsultMessage } from '../utils/whatsapp';
import { useCustomDesigns } from '../context/CustomDesignsContext';

interface Props {
  onResult: (designIds: string[] | null) => void;
}

interface Answers {
  occasion?: Occasion;
  vibe?: Vibe;
  colorMood?: ColorMood;
}

const questions = [
  {
    key: 'occasion' as const,
    title: 'Where is this look going?',
    sub: 'Pick the destination that fits best.',
    options: [
      { value: 'wedding', label: 'A wedding (mine or someone else\'s)' },
      { value: 'gala', label: 'A gala / red carpet' },
      { value: 'traditional', label: 'A traditional / owambe' },
      { value: 'work', label: 'The office / a meeting' },
      { value: 'party', label: 'A dinner or birthday' },
      { value: 'casual', label: 'Everyday / brunch' },
    ],
  },
  {
    key: 'vibe' as const,
    title: 'What vibe describes you most?',
    sub: 'Trust your gut — first instinct is usually right.',
    options: [
      { value: 'romantic', label: 'Romantic & soft' },
      { value: 'bold', label: 'Bold & confident' },
      { value: 'minimal', label: 'Minimal & elegant' },
      { value: 'classic', label: 'Classic & timeless' },
      { value: 'playful', label: 'Playful & fun' },
    ],
  },
  {
    key: 'colorMood' as const,
    title: 'Which palette speaks to you?',
    sub: 'Color often matters more than cut.',
    options: [
      { value: 'neutral', label: 'Cream, ivory & nude' },
      { value: 'jewel', label: 'Burgundy, emerald & sapphire' },
      { value: 'pastel', label: 'Blush, lilac & sky' },
      { value: 'monochrome', label: 'Black, charcoal & white' },
      { value: 'earthy', label: 'Ochre, rust & olive' },
    ],
  },
];

function recommend(a: Required<Answers>, designs: Design[]): { ids: string[]; styleLabel: string } {
  // simple weighted scoring — explainable, runs entirely on-device
  const scored = designs.map((d) => {
    let score = 0;
    if (d.occasions.includes(a.occasion)) score += 3;
    if (d.vibes.includes(a.vibe)) score += 2;
    if (d.colorMood === a.colorMood) score += 2;
    if (d.featured) score += 0.5;
    return { id: d.id, score };
  });

  const top = scored
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((s) => s.id);

  // fallback to featured if no positive scores
  const ids = top.length > 0 ? top : designs.filter((d) => d.featured).map((d) => d.id);

  const styleLabel = `${a.vibe} ${a.colorMood} look for ${a.occasion}`;
  return { ids, styleLabel };
}

export default function StyleQuiz({ onResult }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<{ ids: string[]; styleLabel: string } | null>(null);
  const { customDesigns } = useCustomDesigns();
  const allDesigns = [...customDesigns, ...staticDesigns];

  const total = questions.length;
  const isDone = result !== null;
  const current = questions[step];

  const handleSelect = (value: string) => {
    const next: Answers = { ...answers, [current.key]: value as never };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const r = recommend(next as Required<Answers>, allDesigns);
      setResult(r);
      onResult(r.ids);
      // smooth scroll to collection so they can see picks
      setTimeout(() => {
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    onResult(null);
  };

  return (
    <section id="style-quiz" className="relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-bronze-400/20 via-transparent to-wine-500/15"
      />
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow inline-flex items-center gap-2">
            <Sparkles size={12} /> AI Style Finder
          </p>
          <h2 className="display-2 mt-4">Not sure what you want? Let's find it.</h2>
          <div className="gold-divider mt-8" />
          <p className="mt-6 text-ink-800/70 dark:text-cream-100/70">
            Answer three quick questions and our stylist engine will hand-pick designs
            from the collection that match your moment, your mood, and your palette.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-ink-800/10 bg-cream-50 p-8 shadow-luxe md:p-12 dark:border-cream-100/10 dark:bg-ink-800">
            {/* progress */}
            {!isDone && (
              <div className="mb-8 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800/10 dark:bg-cream-100/10">
                  <motion.div
                    className="h-full bg-bronze-500"
                    initial={false}
                    animate={{ width: `${((step + 1) / total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-ink-800/50 dark:text-cream-100/50">
                  {step + 1} / {total}
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isDone ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="display-3">{current.title}</h3>
                  <p className="mt-2 text-sm text-ink-800/60 dark:text-cream-100/60">
                    {current.sub}
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {current.options.map((o) => (
                      <button
                        type="button"
                        key={o.value}
                        onClick={() => handleSelect(o.value)}
                        className="group flex items-center justify-between rounded-2xl border border-ink-800/10 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-bronze-500 hover:bg-bronze-400/10 dark:border-cream-100/10"
                      >
                        <span className="font-medium">{o.label}</span>
                        <ArrowRight
                          size={16}
                          className="text-bronze-500 transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="eyebrow">Your match</p>
                  <h3 className="display-3 mt-2 capitalize">
                    {result?.styleLabel}
                  </h3>
                  <p className="mt-4 text-ink-800/70 dark:text-cream-100/70">
                    We've highlighted {result?.ids.length} pieces from the collection
                    just for you. Scroll down to view your picks — they're tagged with a{' '}
                    <span className="font-medium text-bronze-500">Stylist Pick</span>{' '}
                    badge.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#collections"
                      className="btn-primary"
                    >
                      View My Picks <ArrowRight size={16} />
                    </a>
                    <a
                      href={buildWhatsAppUrl(styleConsultMessage(result!.styleLabel))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp"
                    >
                      <MessageCircle size={16} /> Book Consultation
                    </a>
                    <button type="button" onClick={reset} className="btn-ghost">
                      <RefreshCw size={14} /> Retake Quiz
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
