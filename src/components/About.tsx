import { motion } from 'framer-motion';
import { Award, Layers, Palette, Pen, Ruler, Scissors, Shirt, Sparkles } from 'lucide-react';
import { pexels } from '../utils/images';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const ABOUT_IMG = pexels(3622614, 1000, 1250);

const DEFAULT_ABOUT_P1 =
  'I started Happiness Fashion World seven years ago in a small studio in Abakaliki with one second-hand sewing machine and a notebook full of sketches. Today, the atelier dresses brides, executives, and women who simply want to feel extraordinary on a regular Tuesday.';

const DEFAULT_ABOUT_P2 =
  "I believe clothing is intimate. The way a sleeve sits, the weight of a hem, the way an Ankara print catches the light at an owambe — these details are what turn fabric into memory. That's the Happiness signature.";

const pillars = [
  {
    icon: Scissors,
    title: 'Hand-Cut Patterns',
    body: 'Every silhouette is drafted from your exact measurements — never off the rack.',
  },
  {
    icon: Sparkles,
    title: 'Signature Finishing',
    body: 'Hand-beaded trims, hidden boning, French seams. Couture details on every piece.',
  },
  {
    icon: Award,
    title: 'Trusted Across Nigeria',
    body: 'From Abakaliki brides to Lagos executives — celebrated for fit, comfort, and elegance.',
  },
];

export default function About() {
  return (
    <section id="about" className="bg-cream-200/40 py-20 md:py-32 dark:bg-ink-800/40">
      <div className="container-luxe grid items-center gap-14 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-luxe">
            <EditableImage
              contentKey="about.image"
              defaultSrc={ABOUT_IMG}
              alt="The designer — Happiness — in her Abakaliki atelier"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-7"
        >
          <p className="eyebrow">About the Designer</p>
          <h2 className="display-2 mt-4">
            A quiet obsession with the way{' '}
            <span className="italic text-bronze-500">a woman feels</span> in what she
            wears.
          </h2>
          <div className="mt-8 space-y-5 text-ink-800/75 dark:text-cream-100/75">
            <p>
              <EditableText contentKey="about.p1" defaultValue={DEFAULT_ABOUT_P1} multiline>
                {(text) => <>{text}</>}
              </EditableText>
            </p>
            <p>
              <EditableText contentKey="about.p2" defaultValue={DEFAULT_ABOUT_P2} multiline>
                {(text) => <>{text}</>}
              </EditableText>
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-ink-800/10 bg-cream-100/60 p-5 backdrop-blur dark:border-cream-100/10 dark:bg-ink-900/40"
              >
                <Icon className="text-bronze-500" size={22} />
                <h4 className="mt-3 font-display text-lg">{title}</h4>
                <p className="mt-1 text-sm text-ink-800/65 dark:text-cream-100/65">{body}</p>
              </div>
            ))}
          </div>

          {/* Tools of the Trade */}
          <div className="mt-8 flex items-center justify-center gap-5">
            {[Scissors, Ruler, Pen, Palette, Layers, Shirt].map((Icon, i) => (
              <Icon key={i} size={20} className="text-bronze-400 opacity-40" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
