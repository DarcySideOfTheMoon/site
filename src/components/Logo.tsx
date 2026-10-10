export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M40 8C28 12 22 22 22 32C22 42 28 52 40 56C30 58 16 50 16 32C16 14 30 6 40 8Z"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <line x1="46" y1="32" x2="60" y2="32" stroke="var(--pink)" strokeWidth="3" />
    </svg>
  );
}

export function ClapperIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8h18M6 8V5.8L8 4h2l1.5 4M13.5 8L15 4h2l1.5 4M3 8v11a1 1 0 001 1h16a1 1 0 001-1V8"
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  );
}
