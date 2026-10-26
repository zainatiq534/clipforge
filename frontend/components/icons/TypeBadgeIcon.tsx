import { cn } from "@/lib/cn";

type TypeBadgeIconProps = {
  className?: string;
};

/** Crisp vector type badge — lavender squircle + framed serif T (matches feature icon). */
export function TypeBadgeIcon({ className }: TypeBadgeIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-11 w-11 shrink-0", className)}
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="12"
        fill="#f3e8ff"
        stroke="#e9e0ff"
        strokeWidth="1"
      />
      {/* Inner square frame with break near bottom-right */}
      <path
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 14.5h19v16.5M33.5 34.5H14.5v-20"
      />
      {/* Serif T */}
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill="#7c3aed"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="15"
        fontWeight="700"
      >
        T
      </text>
    </svg>
  );
}
