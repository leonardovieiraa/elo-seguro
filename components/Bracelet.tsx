import { useId } from "react";

type Props = {
  width?: number;
  sparkles?: boolean;
};

/**
 * Pulseira prateada de elos (curb chain) com plaquinha frontal e coração.
 * Desenhada em SVG: os elos são distribuídos ao longo de uma elipse.
 */
export default function Bracelet({ width = 300, sparkles = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const cx = 200;
  const cy = 92;
  const rx = 168;
  const ry = 58;
  const count = 46;

  const links = Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    // tangente da elipse
    const dx = -rx * Math.sin(t);
    const dy = ry * Math.cos(t);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const flip = i % 2 === 0 ? 1 : -1;
    // elos do fundo (y menor) ficam um pouco menores/mais escuros
    const depth = (Math.sin(t) + 1) / 2; // 0 = fundo, 1 = frente
    return { x, y, angle, flip, depth, i };
  });

  const sorted = [...links].sort((a, b) => a.depth - b.depth);

  return (
    <svg
      viewBox="0 0 400 190"
      width={width}
      style={{ display: "block", overflow: "visible" }}
      role="img"
      aria-label="Pulseira Elo Seguro"
    >
      <defs>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#c9ccd6" />
          <stop offset="0.6" stopColor="#8e92a3" />
          <stop offset="1" stopColor="#e9ebf2" />
        </linearGradient>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f9" />
          <stop offset="0.5" stopColor="#c2c5d1" />
          <stop offset="1" stopColor="#9a9eaf" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter={`url(#${uid}-shadow)`}>
        {sorted.map((l) => {
          const s = 0.8 + l.depth * 0.3;
          return (
            <g
              key={l.i}
              transform={`translate(${l.x} ${l.y}) rotate(${l.angle}) scale(${s})`}
              opacity={0.7 + l.depth * 0.3}
            >
              <g transform={`rotate(${l.flip * 22})`}>
                <rect
                  x={-13}
                  y={-8}
                  width={26}
                  height={16}
                  rx={8}
                  fill="none"
                  stroke={`url(#${uid}-metal)`}
                  strokeWidth={5}
                />
                <rect
                  x={-13}
                  y={-8}
                  width={26}
                  height={16}
                  rx={8}
                  fill="none"
                  stroke="#4a4e62"
                  strokeWidth={0.6}
                  opacity={0.5}
                />
              </g>
            </g>
          );
        })}
      </g>

      {/* Fecho no topo */}
      <g transform={`translate(${cx + 8} ${cy - ry - 4})`}>
        <ellipse rx={16} ry={9} fill="none" stroke={`url(#${uid}-metal)`} strokeWidth={5} />
        <circle cx={-18} cy={2} r={3} fill="#9a9eaf" />
      </g>

      {/* Plaquinha frontal */}
      <g transform={`translate(${cx} ${cy + ry + 2})`} filter={`url(#${uid}-shadow)`}>
        <rect x={-78} y={-19} width={156} height={38} rx={10} fill={`url(#${uid}-plate)`} />
        <rect
          x={-78}
          y={-19}
          width={156}
          height={38}
          rx={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.7}
          strokeWidth={1.2}
        />
        <rect x={-72} y={-13} width={144} height={8} rx={4} fill="#fff" opacity={0.35} />
        {/* coração gravado */}
        <path
          transform="translate(44 1) scale(0.9)"
          d="M0 7 C-14 -3 -9 -14 0 -7 C9 -14 14 -3 0 7 Z"
          fill="none"
          stroke="#5b5f73"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      </g>

      {sparkles && (
        <>
          <Sparkle x={6} y={30} size={14} />
          <Sparkle x={392} y={170} size={13} />
        </>
      )}
    </svg>
  );
}

export function Sparkle({ x, y, size = 12 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <path
      transform={`translate(${x} ${y})`}
      d={`M0 ${-s} C${s * 0.12} ${-s * 0.12} ${s * 0.12} ${-s * 0.12} ${s} 0 C${s * 0.12} ${s * 0.12} ${s * 0.12} ${s * 0.12} 0 ${s} C${-s * 0.12} ${s * 0.12} ${-s * 0.12} ${s * 0.12} ${-s} 0 C${-s * 0.12} ${-s * 0.12} ${-s * 0.12} ${-s * 0.12} 0 ${-s} Z`}
      fill="#fff"
    />
  );
}
