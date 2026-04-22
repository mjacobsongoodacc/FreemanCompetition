export function HurricaneCone() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="h-auto w-full rounded-sm bg-surface-2"
      role="img"
      aria-label="Stylized hurricane track and cone toward the northern Gulf Coast"
    >
      <defs>
        <linearGradient id="coneGrad" x1="0%" y1="100%" x2="70%" y2="0%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Gulf */}
      <path
        d="M0 220 Q120 200 240 210 T480 230 L640 240 L640 400 L0 400 Z"
        fill="rgba(59, 130, 246, 0.05)"
      />

      {/* Cone of uncertainty */}
      <polygon
        points="380,200 520,40 560,80 420,220"
        fill="url(#coneGrad)"
      />

      {/* Forecast track */}
      <path
        d="M 380 200 L 540 50"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="8 6"
      />

      {/* Coastline approximation */}
      <path
        d="M 120 195 L 200 188 L 280 195 L 340 205 L 400 218 L 460 232 L 520 248"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />

      {/* Time markers */}
      <g fontFamily="var(--font-mono), monospace" fontSize="9" fill="var(--text-3)">
        <line x1="420" y1="165" x2="425" y2="155" stroke="var(--border-strong)" />
        <text x="428" y="158">
          24H
        </text>
        <line x1="470" y1="115" x2="478" y2="108" stroke="var(--border-strong)" />
        <text x="482" y="112">
          48H
        </text>
        <line x1="510" y1="72" x2="520" y2="68" stroke="var(--border-strong)" />
        <text x="524" y="72">
          72H
        </text>
      </g>

      {/* Storm position + rings */}
      <circle
        cx="380"
        cy="200"
        r="22"
        fill="none"
        stroke="var(--red)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      <circle
        cx="380"
        cy="200"
        r="14"
        fill="none"
        stroke="var(--red)"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <circle cx="380" cy="200" r="8" fill="var(--red)" />

      {/* User home — Gentilly */}
      <g transform="translate(318, 208)">
        <polygon
          points="0,-7 -6,6 6,6"
          fill="var(--accent)"
          stroke="var(--border-strong)"
          strokeWidth="0.5"
        />
        <text
          x="10"
          y="4"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          fill="var(--text-2)"
        >
          GENTILLY
        </text>
      </g>

      {/* Compass */}
      <g transform="translate(560, 36)">
        <circle
          cx="0"
          cy="0"
          r="14"
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="1"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          fill="var(--text-2)"
        >
          N
        </text>
      </g>
    </svg>
  );
}
