import { Layers, Palette, Pen, Ruler, Scissors, Sparkles } from 'lucide-react';

const icons = [
  { Icon: Scissors, className: 'left-[5%] top-[15%] text-bronze-400 opacity-[0.06]', delay: '0s', size: 36 },
  { Icon: Ruler, className: 'right-[8%] top-[35%] text-bronze-400 opacity-[0.05]', delay: '2s', size: 30 },
  { Icon: Pen, className: 'left-[12%] bottom-[25%] text-wine-400 opacity-[0.05]', delay: '4s', size: 28 },
  { Icon: Sparkles, className: 'right-[15%] bottom-[40%] text-bronze-400 opacity-[0.06]', delay: '1.5s', size: 32 },
  { Icon: Palette, className: 'left-[45%] top-[60%] text-bronze-400 opacity-[0.04]', delay: '3s', size: 26 },
  { Icon: Layers, className: 'right-[35%] top-[10%] text-wine-400 opacity-[0.05]', delay: '5s', size: 28 },
];

export default function FloatingIcons() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {icons.map(({ Icon, className, delay, size }, i) => (
        <Icon
          key={i}
          size={size}
          className={`absolute animate-float ${className}`}
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  );
}
