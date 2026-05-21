interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Happiness Fashion brand mark.
 *
 * A refined "H" monogram with a delicate thread-crossbar and three-cowrie
 * accent, set on a **warm deep-brown** plate (#3D2B1F). The warm background
 * ensures the gold gradient details pop clearly in BOTH light and dark mode.
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
            <stop offset="0%" stopColor="#F2D4A8" />
            <stop offset="50%" stopColor="#E5B87A" />
            <stop offset="100%" stopColor="#C48B4A" />
          </linearGradient>
        </defs>

        {/* Warm deep-brown plate — same in light & dark mode for brand consistency */}
        <rect width="120" height="120" rx="22" fill="#3D2B1F" />

        {/* H — two elegant verticals + delicate stitched-thread crossbar */}
        <g
          stroke="url(#hf-gold)"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Left stem */}
          <line x1="38" y1="26" x2="38" y2="78" strokeWidth="5.5" />
          {/* Right stem */}
          <line x1="82" y1="26" x2="82" y2="78" strokeWidth="5.5" />
          {/* Thread crossbar — dashed for that stitched/threaded effect */}
          <path
            d="M 38 54 C 50 47, 70 47, 82 54"
            strokeWidth="2.6"
            strokeDasharray="1 3"
          />
          {/* Anchor dots where thread meets stems */}
          <circle cx="38" cy="54" r="2" fill="url(#hf-gold)" stroke="none" />
          <circle cx="82" cy="54" r="2" fill="url(#hf-gold)" stroke="none" />
        </g>

        {/* Three-cowrie row — Nigerian cultural accent */}
        <g fill="url(#hf-gold)">
          <circle cx="50" cy="90" r="2" />
          <circle cx="60" cy="90" r="2.4" />
          <circle cx="70" cy="90" r="2" />
        </g>

        {/* Subtle ground line */}
        <line
          x1="42"
          y1="102"
          x2="78"
          y2="102"
          stroke="url(#hf-gold)"
          strokeWidth="0.8"
          opacity="0.5"
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
