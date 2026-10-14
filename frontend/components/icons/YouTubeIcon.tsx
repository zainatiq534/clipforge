import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

export function YouTubeIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
    >
      <path
        fill="#FF0000"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"
      />
      <path fill="#FFFFFF" d="M9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}
