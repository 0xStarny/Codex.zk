import { motion } from "framer-motion";

interface Props {
  number: number;
  title: string;
  state: "locked" | "unlocked" | "completed";
  accentColor: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { svg: 80, fontSize: "0.7rem" },
  md: { svg: 110, fontSize: "0.78rem" },
  lg: { svg: 160, fontSize: "1rem" },
};

export function Pyramid({ number, title, state, accentColor, onClick, size = "md" }: Props) {
  const dim = SIZE_MAP[size];
  const isLocked = state === "locked";
  const isCompleted = state === "completed";

  const fillColor = isLocked
    ? "#1a1a1f"
    : isCompleted
      ? accentColor
      : "#2c2c35";
  const strokeColor = isLocked ? "#3a3a45" : accentColor;
  const opacity = isLocked ? 0.45 : 1;

  return (
    <motion.button
      whileHover={isLocked ? {} : { scale: 1.05, y: -4 }}
      whileTap={isLocked ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={isLocked}
      className={`group relative flex flex-col items-center gap-2 ${
        isLocked ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{ opacity }}
      aria-label={`Investigation ${number}: ${title} — ${state}`}
    >
      <svg
        viewBox="0 0 120 120"
        width={dim.svg}
        height={dim.svg}
        className={isCompleted ? "animate-pyramid-glow" : ""}
      >
        {/* Pyramid base shadow */}
        <ellipse cx="60" cy="105" rx="42" ry="5" fill="#000" opacity="0.4" />
        {/* Pyramid main triangle */}
        <path
          d="M 60 18 L 100 100 L 20 100 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Right face shading */}
        <path
          d="M 60 18 L 100 100 L 60 100 Z"
          fill="#000"
          opacity={isLocked ? 0.5 : 0.25}
        />
        {/* Glyphs / steps */}
        {[35, 55, 75].map((y, i) => (
          <line
            key={i}
            x1={60 - (y - 18) * 0.488}
            y1={y}
            x2={60 + (y - 18) * 0.488}
            y2={y}
            stroke={strokeColor}
            strokeWidth="0.6"
            opacity={isLocked ? 0.25 : 0.5}
          />
        ))}
        {/* Number badge */}
        <circle
          cx="60"
          cy="60"
          r="11"
          fill={isCompleted ? "#0a0a0c" : isLocked ? "#1a1a1f" : "#0a0a0c"}
          stroke={strokeColor}
          strokeWidth="1.2"
        />
        <text
          x="60"
          y="64.5"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="13"
          fontWeight="600"
          fill={strokeColor}
        >
          {number}
        </text>
        {/* Lock icon overlay */}
        {isLocked && (
          <g transform="translate(50,72)">
            <rect x="2" y="6" width="16" height="12" rx="2" fill="#3a3a45" />
            <path
              d="M 5 6 L 5 3 Q 5 -1 10 -1 Q 15 -1 15 3 L 15 6"
              stroke="#3a3a45"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
        {/* Completed checkmark */}
        {isCompleted && (
          <g transform="translate(82,82)">
            <circle r="9" fill="#0a0a0c" stroke={accentColor} strokeWidth="1.5" />
            <path
              d="M -4 0 L -1 3 L 4 -2"
              stroke={accentColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
      <div
        className={`text-center max-w-[140px] leading-tight transition-opacity ${
          isLocked ? "opacity-50" : "opacity-100"
        }`}
        style={{ fontSize: dim.fontSize }}
      >
        <div className="font-mono opacity-60 mb-0.5">CASE #{number.toString().padStart(2, "0")}</div>
        <div className="font-serif italic">{isLocked ? "—" : title}</div>
      </div>
    </motion.button>
  );
}
