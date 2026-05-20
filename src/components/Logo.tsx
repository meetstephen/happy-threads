interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Happiness Fashion brand mark.
 * Stylized "H" inside a double-ring crest with a couture "thread arc"
 * crossbar — meant to read as both a monogram and a needle pulling thread.
 */
export default function Logo({ size = 40, withWordmark = false, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-label="Happiness Fashion"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="hf-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5B98A" />
            <stop offset="50%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#8E5E37" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" className="fill-ink-900 dark:fill-cream-100" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#hf-gold)" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="url(#hf-gold)"
          strokeWidth="0.5"
          strokeDasharray="1.5 2.5"
        />
        <g stroke="url(#hf-gold)" strokeLinecap="round" fill="none">
          <line x1="34" y1="30" x2="34" y2="70" strokeWidth="3" />
          <line x1="66" y1="30" x2="66" y2="70" strokeWidth="3" />
          <path d="M34 50 Q50 38 66 50" strokeWidth="2" />
        </g>
        <circle cx="50" cy="42" r="1.6" fill="url(#hf-gold)" />
        <circle cx="50" cy="76" r="1" fill="url(#hf-gold)" />
      </svg>

      {withWordmark && (
        <div className="leading-tight">
          <div className="font-display text-lg italic tracking-wide">Happiness</div>
          <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-bronze-500">
            Fashion Atelier
          </div>
        </div>
      )}
    </div>
  );
}
