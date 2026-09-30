interface BrandMarkProps {
  size?: number;
  /** Unique prefix so several marks on one page don't share gradient ids. */
  idPrefix: string;
  className?: string;
}

/** Monogram: three offset vertebrae inside a navy glass tile (matches app/icon.svg). */
export function BrandMark({ size = 44, idPrefix, className }: BrandMarkProps) {
  const tile = `${idPrefix}-tile`;
  const bar = `${idPrefix}-bar`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={tile} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34479A" />
          <stop offset="1" stopColor="#141D48" />
        </linearGradient>
        <linearGradient id={bar} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#A8B6F3" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${tile})`} />
      <rect x="1" y="1" width="62" height="62" rx="17" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" />
      <rect x="18" y="13" width="25" height="9" rx="4.5" fill={`url(#${bar})`} />
      <rect x="22" y="27.5" width="25" height="9" rx="4.5" fill={`url(#${bar})`} />
      <rect x="18" y="42" width="25" height="9" rx="4.5" fill={`url(#${bar})`} />
    </svg>
  );
}
