type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
});

export const BellIcon = ({ size = 28 }: P) => (
  <svg {...base(size)}>
    <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" />
  </svg>
);

export const HeartOutline = ({ size = 30 }: P) => (
  <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
    <path d="M12 20.5C4 14.5 3.5 8.5 7.5 6.5c2-1 3.7 0 4.5 1.5.8-1.5 2.5-2.5 4.5-1.5 4 2 3.5 8-4.5 14Z" />
  </svg>
);

export const UsersIcon = ({ size = 34 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="7" r="3.2" />
    <circle cx="5.5" cy="9" r="2.4" />
    <circle cx="18.5" cy="9" r="2.4" />
    <path d="M12 11.5c-3.3 0-6 1.8-6 4.2V18h12v-2.3c0-2.4-2.7-4.2-6-4.2Z" />
    <path d="M5.5 11.5C3.2 11.5 1.5 12.9 1.5 14.6V17H5v-1.3c0-1.5.6-2.8 1.7-3.7-.4-.3-.8-.5-1.2-.5Zm13 0c-.4 0-.8.2-1.2.5 1.1.9 1.7 2.2 1.7 3.7V17h3.5v-2.4c0-1.7-1.7-3.1-4-3.1Z" />
  </svg>
);

export const PinIcon = ({ size = 34 }: P) => (
  <svg {...base(size)}>
    <path d="M12 2C8.1 2 5 5 5 8.8 5 14 12 22 12 22s7-8 7-13.2C19 5 15.900 2 12 2Zm0 9.500a2.700 2.700 0 1 1 0-5.400 2.700 2.700 0 0 1 0 5.400Z" />
  </svg>
);

export const GearIcon = ({ size = 34 }: P) => (
  <svg {...base(size)}>
    <path d="M19.400 13a7.800 7.800 0 0 0 0-2l2.100-1.600a.5.5 0 0 0 .1-.6l-2-3.500a.5.5 0 0 0-.6-.2l-2.500 1a7.300 7.300 0 0 0-1.700-1l-.4-2.600a.5.500 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.400L9 5.100a7.300 7.300 0 0 0-1.700 1l-2.500-1a.5.5 0 0 0-.6.200l-2 3.500a.5.5 0 0 0 .1.600L4.600 11a7.800 7.800 0 0 0 0 2l-2.100 1.600a.5.5 0 0 0-.1.600l2 3.500c.1.200.4.300.6.200l2.500-1c.5.400 1.100.7 1.700 1l.4 2.600c0 .2.200.4.500.4h4c.3 0 .5-.2.500-.4l.4-2.600c.6-.3 1.200-.6 1.700-1l2.500 1c.2.100.5 0 .6-.2l2-3.500a.5.5 0 0 0-.1-.6L19.400 13ZM12 15.500a3.500 3.500 0 1 1 0-7 3.500 3.500 0 0 1 0 7Z" />
  </svg>
);

export const DocIcon = ({ size = 34 }: P) => (
  <svg {...base(size)}>
    <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.500V8h4.500L13 3.500ZM7.500 12h9v1.600h-9V12Zm0 3.300h9v1.600h-9v-1.600Zm0 3.200h6v1.500h-6v-1.500Z" />
  </svg>
);

export const WarningIcon = ({ size = 34 }: P) => (
  <svg {...base(size)}>
    <path d="M12 2.500 1.500 21h21L12 2.500Zm-1 7h2v6h-2v-6Zm0 8h2v2h-2v-2Z" />
  </svg>
);

export const HomeIcon = ({ size = 28 }: P) => (
  <svg {...base(size)}>
    <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3Z" />
  </svg>
);

export const ChartIcon = ({ size = 28 }: P) => (
  <svg {...base(size)}>
    <rect x="4" y="12" width="3.500" height="8" rx="1" />
    <rect x="10.200" y="4" width="3.500" height="16" rx="1" />
    <rect x="16.500" y="9" width="3.500" height="11" rx="1" />
  </svg>
);

export const UserIcon = ({ size = 28 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="7.500" r="4" />
    <path d="M4 21c0-4.200 3.600-7 8-7s8 2.800 8 7H4Z" />
  </svg>
);

export const ChevronDown = ({ size = 14 }: P) => (
  <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 9 7 7 7-7" />
  </svg>
);

export const BatteryIcon = ({ size = 26 }: P) => (
  <svg viewBox="0 0 28 14" width={size} height={size / 2} aria-hidden>
    <rect x="0.500" y="0.500" width="23" height="13" rx="3" fill="none" stroke="currentColor" />
    <rect x="2" y="2" width="17" height="10" rx="1.800" fill="currentColor" />
    <rect x="25" y="4.500" width="2.500" height="5" rx="1" fill="currentColor" />
  </svg>
);

export const SignalIcon = ({ size = 16 }: P) => (
  <svg viewBox="0 0 18 12" width={size} height={(size * 12) / 18} fill="currentColor" aria-hidden>
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5.500" width="3" height="6.500" rx="1" />
    <rect x="10" y="3" width="3" height="9" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" />
  </svg>
);

export const WifiIcon = ({ size = 16 }: P) => (
  <svg viewBox="0 0 24 18" width={size} height={(size * 18) / 24} fill="currentColor" aria-hidden>
    <path d="M12 3.500c3.500 0 6.700 1.400 9 3.700l1.800-1.900A15.400 15.400 0 0 0 12 .8C7.800.8 4 2.500 1.200 5.300L3 7.200a12.800 12.800 0 0 1 9-3.700Zm0 5.300c2.100 0 4 .8 5.400 2.200l1.800-1.900A10.300 10.300 0 0 0 12 6.200c-2.800 0-5.300 1.100-7.200 2.900L6.600 11A7.700 7.700 0 0 1 12 8.800ZM12 14.200c1 0 1.900.4 2.600 1.100L12 18l-2.600-2.700c.7-.7 1.600-1.100 2.600-1.100Z" />
  </svg>
);

export const SirenIcon = ({ size = 150 }: P) => (
  <svg viewBox="0 0 150 150" width={size} height={size} aria-hidden>
    <defs>
      <radialGradient id="sirenGlow" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ff8a8a" />
        <stop offset="0.4" stopColor="#ee1c2e" />
        <stop offset="1" stopColor="#8a0a1c" />
      </radialGradient>
      <linearGradient id="sirenBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3a46" />
        <stop offset="1" stopColor="#0c0c12" />
      </linearGradient>
    </defs>
    <path d="M40 98V70a35 35 0 0 1 70 0v28Z" fill="url(#sirenGlow)" />
    <path d="M52 94V70a23 23 0 0 1 14-21" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" />
    <rect x="32" y="98" width="86" height="14" rx="4" fill="url(#sirenBase)" />
    <rect x="22" y="110" width="106" height="16" rx="6" fill="#111118" />
    <g stroke="#ff5a5a" strokeWidth="5" strokeLinecap="round">
      <path d="M8 60h14" />
      <path d="M128 60h14" />
      <path d="M20 30l12 10" />
      <path d="M130 30l-12 10" />
    </g>
  </svg>
);
