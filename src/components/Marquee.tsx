import { Scissors } from 'lucide-react';

const items = [
  'Bridal Couture',
  'Aso-Ebi & Owambe',
  'Ankara Tailoring',
  'Kaftans & Boubou',
  "Men's Agbada",
  'Made in Abakaliki',
];

function MarqueeItem({ text }: { text: string }) {
  return (
    <>
      <span className="font-display text-2xl italic text-bronze-400 md:text-3xl">
        {text}
      </span>
      <Scissors size={18} className="flex-shrink-0 text-bronze-400" />
    </>
  );
}

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section
      aria-hidden
      className="border-y border-ink-800/10 bg-ink-800 py-5 text-cream-100 dark:border-cream-100/10 dark:bg-cream-100 dark:text-ink-900"
    >
      <div className="overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] items-center gap-12 whitespace-nowrap">
          {row.map((t, i) => (
            <MarqueeItem key={i} text={t} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
