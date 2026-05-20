interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Happiness Fashion brand mark.
 *
 * A refined sans-serif "H" with a delicate fashion-thread crossbar and
 * a small Nigerian three-cowrie accent below. Designed as a clean
 * luxury monogram — no heavy crest, no decorative noise. Reads beautifully
 * at any size from 16px favicon to large hero header.
 */
export default function Logo({ size = 44, withWordmark = false, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        aria-label="Happiness Fashion"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="hf-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C098" />
            <stop offset="50%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#8E5E37" />
          </linearGradient>
        </defs>

        {/* dark plate */}
        <rect width="120" height="120" rx="22" className="fill-ink-900 dark:fill-cream-100" />

        {/* H — two slim verticals + delicate stitched crossbar */}
        <g
          stroke="url(#hf-gold)"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <line x1="38" y1="28" x2="38" y2="80" strokeWidth="5" />
          <line x1="82" y1="28" x2="82" y2="80" strokeWidth="5" />
          <path
            d="M 38 56 C 50 50, 70 50, 82 56"
            strokeWidth="2.4"
            strokeDasharray="0.8 2.6"
          />
          <circle cx="38" cy="56" r="1.7" fill="url(#hf-gold)" stroke="none" />
          <circle cx="82" cy="56" r="1.7" fill="url(#hf-gold)" stroke="none" />
        </g>

        {/* Nigerian three-cowrie row beneath the H */}
        <g fill="url(#hf-gold)">
          <circle cx="52" cy="92" r="1.6" />
          <circle cx="60" cy="92" r="2.0" />
          <circle cx="68" cy="92" r="1.6" />
        </g>

        <line
          x1="44"
          y1="100"
          x2="76"
          y2="100"
          stroke="url(#hf-gold)"
          strokeWidth="0.6"
          opacity="0.55"
        />
      </svg>

      {withWordmark && (
        <div className="leading-tight">
          <div className="font-display text-lg italic tracking-wide">Happiness</div>
          <div className="text-[10px] font-medium uppercase tracking-[0.34em] text-bronze-500">
            Fashion · Nigeria
          </div>
        </div>
      )}
    </div>
  );
}
