import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/** Blue graduation mortarboard on white squircle. */
export function GraduationIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <g fill="#3B82F6">
        {/* Cap top (diamond) */}
        <path d="M24 12.5 37.5 22.2 24 31.9 10.5 22.2 24 12.5Z" />
        {/* Cap band */}
        <path d="M16.2 24.8v5.1c0 2.4 3.4 4.4 7.8 4.4s7.8-2 7.8-4.4v-5.1l-7.8 5.6-7.8-5.6Z" />
        {/* Tassel string + bobble */}
        <path
          d="M33.6 20.8c.2 2.6 1.1 4.4 2.5 6.4"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="36.6" cy="29.2" r="2.2" />
      </g>
      {/* Center diamond highlight */}
      <path d="M24 18.6 26.4 21.2 24 23.8 21.6 21.2 24 18.6Z" fill="#FFFFFF" />
    </svg>
  );
}
