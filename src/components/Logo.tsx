interface Props {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

/**
 * Happiness Fashion World brand mark — an interlocked HFW monogram.
 *
 * The H and F share a central vertical stem. The W is rendered as a
 * classic serif W with angled strokes. Together the three letters form
 * one elegant, integrated mark.
 *
 * Inspired by classic fashion-house typography (Vogue, Dior, Vera Wang)
 * — slab-serif terminals on the verticals, vertical gold gradient, subtle
 * inner ring for an embossed-luxury feel, and a three-cowrie row beneath
 * as a Nigerian cultural accent.
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
        aria-label="Happiness Fashion World"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="hf-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4D9B0" />
            <stop offset="45%" stopColor="#E5B87A" />
            <stop offset="100%" stopColor="#A6703F" />
          </linearGradient>
        </defs>

        {/* Warm brown plate */}
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

        {/* HFW monogram */}
        <g fill="url(#hf-gold)">
          {/* H left vertical with slab terminals */}
          <rect x="14" y="30" width="10" height="2.2" rx="0.5" />
          <rect x="16.5" y="30" width="6" height="54" rx="1.4" />
          <rect x="14" y="81.8" width="10" height="2.2" rx="0.5" />

          {/* H right vertical / F spine (shared stem) */}
          <rect x="38" y="30" width="10" height="2.2" rx="0.5" />
          <rect x="40.5" y="30" width="6" height="54" rx="1.4" />
          <rect x="38" y="81.8" width="10" height="2.2" rx="0.5" />

          {/* H crossbar */}
          <rect x="19.5" y="53.5" width="24" height="5" rx="1.4" />

          {/* F top arm extending right from shared stem */}
          <rect x="40.5" y="30" width="26" height="5" rx="1.4" />

          {/* F top-arm terminal serif */}
          <rect x="64.5" y="28.5" width="2.2" height="8.5" rx="0.5" />

          {/* F middle arm extending right */}
          <rect x="43.5" y="53.5" width="20" height="5" rx="1.4" />

          {/* F middle-arm terminal serif */}
          <rect x="61.5" y="52" width="2.2" height="8.5" rx="0.5" />

          {/* W — four angled strokes */}
          <rect x="70" y="30" width="5.5" height="54" rx="1.4" transform="rotate(-8 72.75 57)" />
          <rect x="79" y="30" width="5.5" height="54" rx="1.4" transform="rotate(8 81.75 57)" />
          <rect x="88" y="30" width="5.5" height="54" rx="1.4" transform="rotate(-8 90.75 57)" />
          <rect x="97" y="30" width="5.5" height="54" rx="1.4" transform="rotate(8 99.75 57)" />

          {/* W slab terminals top */}
          <rect x="67" y="29" width="8" height="2.2" rx="0.5" transform="rotate(-8 71 30.1)" />
          <rect x="77" y="29" width="8" height="2.2" rx="0.5" transform="rotate(8 81 30.1)" />
          <rect x="86" y="29" width="8" height="2.2" rx="0.5" transform="rotate(-8 90 30.1)" />
          <rect x="95" y="29" width="8" height="2.2" rx="0.5" transform="rotate(8 99 30.1)" />
        </g>

        {/* Three-cowrie row — Nigerian cultural accent */}
        <g fill="url(#hf-gold)">
          <circle cx="40" cy="97" r="2.4" />
          <circle cx="60" cy="97.5" r="3" />
          <circle cx="80" cy="97" r="2.4" />
        </g>
      </svg>

      {withWordmark && (
        <div className="leading-tight">
          <div className="font-display text-lg italic tracking-normal">Happiness Fashion World</div>
          <div className="text-[10px] font-medium uppercase tracking-[0.34em] text-bronze-500">
            Luxury Couture · Nigeria
          </div>
        </div>
      )}
    </div>
  );
}
