import { useId } from "react";

/** Escudo com coração rosa e órbita (logo do Elo Seguro). */
export default function Logo({ size = 120 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-pink`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7c4e0" />
          <stop offset="1" stopColor="#e98bbd" />
        </linearGradient>
      </defs>
      {/* escudo */}
      <path
        d="M60 6 L104 22 L104 62 C104 92 84 116 60 130 C36 116 16 92 16 62 L16 22 Z"
        fill="none"
        stroke="#ececfa"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      {/* coração */}
      <path
        d="M60 92 C30 70 38 42 60 56 C82 42 90 70 60 92 Z"
        fill={`url(#${uid}-pink)`}
        stroke={`url(#${uid}-pink)`}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* órbita */}
      <path
        d="M10 98 C40 112 100 96 112 46"
        fill="none"
        stroke={`url(#${uid}-pink)`}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
