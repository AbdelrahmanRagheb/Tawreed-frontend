type Props = {
  className?: string;
  showWordmark?: boolean;
};

// A faithful re-creation of the Tawreed logo in SVG (truck → store)
export default function Logo({ className = "", showWordmark = true }: Props) {
  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tawreed Logo"
    >
      {/* Swoosh arrow */}
      <path
        d="M50 130 C 80 60, 200 50, 260 95 L255 80 L285 100 L260 120 Z"
        fill="#1e3a8a"
        opacity="0.95"
      />
      {/* Speed lines */}
      <path d="M55 165 L120 165" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
      <path d="M45 185 L130 185" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 205 L140 205" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />

      {/* Truck body */}
      <g fill="#1e3a8a">
        {/* Cargo box */}
        <rect x="100" y="155" width="125" height="90" rx="4" />
        {/* Cab */}
        <path d="M225 175 L275 175 L295 205 L295 245 L225 245 Z" />
        {/* Window */}
        <path d="M232 182 L272 182 L286 205 L232 205 Z" fill="#ffffff" />
        {/* Driver silhouette */}
        <circle cx="252" cy="190" r="5" fill="#1e3a8a" />
        <path d="M244 205 Q 252 196 260 205 Z" fill="#1e3a8a" />
        {/* Bumper */}
        <rect x="100" y="245" width="195" height="10" />
      </g>
      {/* Wheels */}
      <circle cx="135" cy="260" r="14" fill="#1e3a8a" />
      <circle cx="135" cy="260" r="6" fill="#ffffff" />
      <circle cx="175" cy="260" r="14" fill="#1e3a8a" />
      <circle cx="175" cy="260" r="6" fill="#ffffff" />
      <circle cx="265" cy="260" r="14" fill="#1e3a8a" />
      <circle cx="265" cy="260" r="6" fill="#ffffff" />

      {/* Dashed road */}
      <path
        d="M305 275 Q 380 295 460 275"
        stroke="#1e3a8a"
        strokeWidth="4"
        strokeDasharray="10 8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Store */}
      <g fill="#1e3a8a">
        {/* Roof slab */}
        <rect x="420" y="120" width="160" height="12" />
        {/* Awning */}
        <path d="M425 132 L575 132 L555 165 L445 165 Z" />
        <path d="M445 132 L440 165 M470 132 L468 165 M495 132 L495 165 M520 132 L522 165 M545 132 L550 165"
              stroke="#ffffff" strokeWidth="3" fill="none" />
        {/* Columns */}
        <rect x="430" y="165" width="10" height="110" />
        <rect x="560" y="165" width="10" height="110" />
        {/* Base */}
        <rect x="420" y="270" width="160" height="8" />
      </g>
      {/* Shopkeeper */}
      <g fill="#1e3a8a">
        <circle cx="475" cy="195" r="7" />
        <rect x="465" y="205" width="20" height="35" rx="3" />
        <rect x="463" y="240" width="9" height="25" />
        <rect x="478" y="240" width="9" height="25" />
      </g>
      {/* Boxes */}
      <g fill="#1e3a8a">
        <rect x="510" y="225" width="22" height="22" />
        <rect x="535" y="225" width="22" height="22" />
        <rect x="522" y="200" width="22" height="22" />
      </g>

      {showWordmark && (
        <g>
          <text
            x="120"
            y="345"
            fontFamily="Inter, sans-serif"
            fontWeight="800"
            fontSize="56"
            fill="#1e3a8a"
            letterSpacing="2"
          >
            TAWREED
          </text>
          <line x1="365" y1="305" x2="365" y2="355" stroke="#1e3a8a" strokeWidth="3" />
          <text
            x="385"
            y="345"
            fontFamily="Cairo, sans-serif"
            fontWeight="700"
            fontSize="52"
            fill="#1e3a8a"
          >
            توريد
          </text>
        </g>
      )}
    </svg>
  );
}
