import type { ReactNode } from "react";
import { BarChart3, Bolt, Users } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

type Stat = {
  icon: ReactNode;
  emphasis: string;
  label: string;
};

const stats: Stat[] = [
  {
    icon: <Bolt className="h-4 w-4" strokeWidth={2.25} />,
    emphasis: "10x",
    label: "Faster Editing",
  },
  {
    icon: <Users className="h-4 w-4" strokeWidth={2.25} />,
    emphasis: "5–10",
    label: "Viral Clips per Video",
  },
  {
    icon: <BarChart3 className="h-4 w-4" strokeWidth={2.25} />,
    emphasis: "Grow",
    label: "Your Audience",
  },
];

type StatsRowProps = {
  className?: string;
};

export function StatsRow({ className }: StatsRowProps) {
  return (
    <ul
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10",
        className,
      )}
    >
      {stats.map((stat) => (
        <li key={stat.label} className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8b5cf6]/20 text-[#c4a1ff]">
            {stat.icon}
          </span>
          <div className="text-left">
            <Typography as="p" size="stat" tone="white" className="leading-tight">
              {stat.emphasis}{" "}
              <Typography as="span" size="caption" tone="muted" className="font-medium">
                {stat.label}
              </Typography>
            </Typography>
          </div>
        </li>
      ))}
    </ul>
  );
}
