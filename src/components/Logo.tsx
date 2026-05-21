interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Happiness Fashion brand mark — an interlocked HF monogram.
 *
 * The H and F share a central vertical stem. The H's crossbar continues
 * past that shared stem to become the F's middle arm, creating one
 * elegant, integrated mark instead of two separate letters.
 *
 * Inspired by classic fashion-house typography (Vogue, Dior, Vera Wang)
 * — slab-serif terminals on the verticals, vertical gold gradient, subtle
 * inner ring for an embossed-luxury feel, and a small three-cowrie row
 * beneath as a quiet Nigerian accent.
 *
 * Set on a warm deep-brown plate (#3D2B1F) so the gold pops at every size
 * — favicon, navbar, footer, social-share preview.
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
          <linearGradient id="hf-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4D9B0" />
            <stop offset="45%" stopColor="#E5B87A" />
            <stop offset="100%" stopColor="#A6703F" />
          </linearGradient>
        </defs>

        {/* Warm brown plate — same in light & dark mode */}
        <rect width="120" height="120" rx="22" fill="#3D2B1F" />

        {/* Subtle inner ring for embossed luxury feel */}
        <rect
          x="7"
          y="7"
          width="106"
          height="106"
          rx="17"
          fill="none"
          stroke="url(#hf-gold)"
          strokeWidth="0.5"
          opacity="0.35"
        />

        {/* Interlocked HF monogram */}
        <g fill="url(#hf-gold)">
          {/* H — left vertical (with subtle slab-serif terminals) */}
          <rect x="22" y="28" width="14" height="2.5" rx="0.5" />
          <rect x="25.5" y="28" width="7" height="64" rx="1.6" />
          <rect x="22" y="89.5" width="14" height="2.5" rx="0.5" />

          {/* Shared central vertical (right of H, spine of F) */}
          <rect x="58" y="28" width="14" height="2.5" rx="0.5" />
          <rect x="61.5" y="28" width="7" height="64" rx="1.6" />
          <rect x="58" y="89.5" width="14" height="2.5" rx="0.5" />

          {/* H crossbar — extends out past the shared stem to become F's middle arm */}
          <rect x="29" y="58.5" width="65" height="6" rx="1.6" />

          {/* F top arm — extends right from the shared stem */}
          <rect x="61.5" y="28" width="36" height="6" rx="1.6" />

          {/* F top-arm terminal serif (a small vertical tick at the very end, classic Didone) */}
          <rect x="95.5" y="26" width="2.5" height="10" rx="0.5" />
          {/* F middle-arm terminal serif */}
          <rect x="91.5" y="56.5" width="2.5" height="10" rx="0.5" />
        </g>

        {/* Three-cowrie row — quiet Nigerian accent */}
        <g fill="url(#hf-gold)">
          <circle cx="47" cy="103" r="1.6" />
          <circle cx="60" cy="103.5" r="2.2" />
          <circle cx="73" cy="103" r="1.6" />
        </g>
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
