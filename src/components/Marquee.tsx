const items = [
  'Bridal Couture',
  '✦',
  'Aso-Ebi & Owambe',
  '✦',
  'Made-to-Measure',
  '✦',
  "Men's Tailoring",
  '✦',
  'Ready-to-Wear',
  '✦',
  'Hand-Beaded Finishes',
  '✦',
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section
      aria-hidden
      className="border-y border-ink-800/10 bg-ink-800 py-5 text-cream-100 dark:border-cream-100/10 dark:bg-cream-100 dark:text-ink-900"
    >
      <div className="overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-12 whitespace-nowrap">
          {row.map((t, i) => (
            <span
              key={i}
              className="font-display text-2xl italic text-bronze-400 md:text-3xl"
            >
              {t}
            </span>
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
