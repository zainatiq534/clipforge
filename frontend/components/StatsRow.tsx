import { BarChart3, Bolt, Users } from "lucide-react";
import { Icon, IconBadge } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const stats = [
  {
    icon: <Icon icon={Bolt} size="md" />,
    emphasis: "10x",
    label: "Faster Editing",
  },
  {
    icon: <Icon icon={Users} size="md" />,
    emphasis: "5–10",
    label: "Viral Clips per Video",
  },
  {
    icon: <Icon icon={BarChart3} size="md" />,
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
          <IconBadge>{stat.icon}</IconBadge>
          <div className="text-left">
            <Typography as="p" variant="stat" tone="white" className="leading-tight">
              {stat.emphasis}{" "}
              <Typography as="span" variant="caption" tone="muted" weight="medium">
                {stat.label}
              </Typography>
            </Typography>
          </div>
        </li>
      ))}
    </ul>
  );
}
