interface Props {
  size?: number;
  className?: string;
}

/**
 * Stylized SVG of Noiro the masked detective: fedora, mask, trench coat collar.
 * Designed cute/approachable with a noir silhouette.
 */
export function NoiroIcon({ size = 64, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hat brim shadow */}
      <ellipse cx="50" cy="32" rx="38" ry="6" fill="#0a0a0c" opacity="0.85" />
      {/* Fedora top */}
      <path
        d="M 30 32 Q 30 14 50 14 Q 70 14 70 32 Z"
        fill="#1a1a1f"
        stroke="#d4a14a"
        strokeWidth="1.2"
      />
      {/* Hat band */}
      <rect x="30" y="28" width="40" height="3.5" fill="#d4a14a" opacity="0.85" />
      {/* Hat dent */}
      <path d="M 45 18 Q 50 22 55 18" stroke="#0a0a0c" strokeWidth="1" fill="none" />
      {/* Face */}
      <ellipse cx="50" cy="48" rx="18" ry="20" fill="#f4ecdc" />
      {/* Mask */}
      <path
        d="M 32 45 Q 32 41 38 41 L 46 41 Q 50 41 50 44 Q 50 41 54 41 L 62 41 Q 68 41 68 45 L 68 50 Q 68 54 62 54 L 54 54 Q 50 54 50 51 Q 50 54 46 54 L 38 54 Q 32 54 32 50 Z"
        fill="#0a0a0c"
      />
      {/* Mask eye highlights */}
      <circle cx="42" cy="48" r="1.5" fill="#d4a14a" />
      <circle cx="58" cy="48" r="1.5" fill="#d4a14a" />
      {/* Cheeks (subtle warmth) */}
      <circle cx="40" cy="58" r="2.5" fill="#c75850" opacity="0.25" />
      <circle cx="60" cy="58" r="2.5" fill="#c75850" opacity="0.25" />
      {/* Mouth */}
      <path d="M 46 62 Q 50 65 54 62" stroke="#1a1a1f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Trench coat collar (suggested) */}
      <path
        d="M 30 70 L 22 92 L 50 88 L 78 92 L 70 70 Z"
        fill="#1a1a1f"
        stroke="#d4a14a"
        strokeWidth="1"
      />
      {/* Tie / scarf accent */}
      <path d="M 47 70 L 50 82 L 53 70 Z" fill="#c75850" opacity="0.85" />
    </svg>
  );
}
